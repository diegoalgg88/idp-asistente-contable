"""
Rate Limiter Factory with Redis Support

Provides a factory function to create rate limiters with Redis storage for production
environments, with automatic fallback to memory storage for development.
"""

import os
from typing import Optional
from slowapi import Limiter
from slowapi.util import get_remote_address
from redis import Redis, ConnectionError, TimeoutError
from fastapi import Request


def get_remote_address(request: Request) -> str:
    """
    Get client identifier for rate limiting.
    
    Uses user ID if authenticated, otherwise IP address.
    
    Args:
        request: FastAPI request object
        
    Returns:
        str: Client identifier (user ID or IP address)
    """
    # Try to get user from state (set by auth middleware)
    if hasattr(request.state, "user") and request.state.user:
        return f"user:{request.state.user.id}"
    
    # Fallback to IP address
    client_ip = request.client.host if request.client else "unknown"
    return f"ip:{client_ip}"


def create_redis_client(
    host: str,
    port: int,
    db: int = 0,
    decode_responses: bool = True,
    socket_connect_timeout: int = 5,
    socket_timeout: int = 5,
    health_check_interval: int = 30,
) -> Optional[Redis]:
    """
    Create a Redis client with connection pooling.
    
    Args:
        host: Redis host
        port: Redis port
        db: Redis database number
        decode_responses: Whether to decode responses to strings
        socket_connect_timeout: Connection timeout in seconds
        socket_timeout: Socket timeout in seconds
        health_check_interval: Health check interval in seconds
        
    Returns:
        Redis client or None if connection fails
    """
    try:
        redis_client = Redis(
            host=host,
            port=port,
            db=db,
            decode_responses=decode_responses,
            socket_connect_timeout=socket_connect_timeout,
            socket_timeout=socket_timeout,
            health_check_interval=health_check_interval,
            socket_keepalive=True,
            retry_on_timeout=True,
        )
        
        # Test connection
        redis_client.ping()
        return redis_client
        
    except (ConnectionError, TimeoutError) as e:
        print(f"⚠️ Redis connection failed: {e}")
        return None


def get_limiter(
    default_limits: Optional[list] = None,
    strategy: str = "fixed-window",
) -> Limiter:
    """
    Create a rate limiter with Redis storage (fallback to memory).
    
    This factory function attempts to connect to Redis for production-grade
    rate limiting with distributed state. If Redis is unavailable, it automatically
    falls back to in-memory storage for development/testing.
    
    Args:
        default_limits: List of default rate limits (e.g., ["40 per minute"])
        strategy: Rate limiting strategy ("fixed-window", "sliding-window", "fixed-window-elastic")
        
    Returns:
        Configured SlowAPI Limiter instance
        
    Example:
        >>> limiter = get_limiter(default_limits=["40 per minute"])
        >>> app.state.limiter = limiter
    """
    # Default rate limits from environment or sensible defaults
    if default_limits is None:
        rate_limit = os.getenv("RATE_LIMIT", "40")
        default_limits = [f"{rate_limit} per minute"]
    
    # Get Redis configuration from environment
    redis_host = os.getenv("REDIS_HOST", "localhost")
    redis_port = int(os.getenv("REDIS_PORT", 6379))
    redis_url = os.getenv("REDIS_URL", f"redis://{redis_host}:{redis_port}/0")
    
    # Try to parse Redis URL if provided
    if redis_url and redis_url.startswith("redis://"):
        try:
            # Parse redis://host:port/db format
            parts = redis_url.replace("redis://", "").split("/")
            host_port = parts[0].split(":")
            redis_host = host_port[0]
            if len(host_port) > 1:
                redis_port = int(host_port[1])
        except (ValueError, IndexError):
            pass
    
    # Attempt to create Redis client
    redis_client = create_redis_client(
        host=redis_host,
        port=redis_port,
    )
    
    # Create storage based on Redis availability
    if redis_client is not None:
        storage_uri = redis_url
        print(f"✅ Redis rate limiting enabled ({redis_host}:{redis_port})")
    else:
        storage_uri = "memory://"
        print(f"⚠️ Using memory storage (Redis unavailable at {redis_host}:{redis_port})")
    
    # Create and return limiter
    limiter = Limiter(
        key_func=get_remote_address,
        storage_uri=storage_uri,
        default_limits=default_limits,
        strategy=strategy,
    )
    
    return limiter


def check_redis_health() -> dict:
    """
    Check Redis connection health.
    
    Returns:
        dict: Health status with connection info
        
    Example:
        >>> health = check_redis_health()
        >>> print(health["status"])  # "healthy" or "unhealthy"
    """
    redis_host = os.getenv("REDIS_HOST", "localhost")
    redis_port = int(os.getenv("REDIS_PORT", 6379))
    
    result = {
        "status": "unhealthy",
        "host": redis_host,
        "port": redis_port,
        "error": None,
    }
    
    try:
        redis_client = create_redis_client(host=redis_host, port=redis_port)
        
        if redis_client is not None:
            result["status"] = "healthy"
            result["connected_clients"] = redis_client.info("clients").get(
                "connected_clients", "unknown"
            )
            result["used_memory"] = redis_client.info("memory").get(
                "used_memory_human", "unknown"
            )
            
    except (ConnectionError, TimeoutError) as e:
        result["error"] = str(e)
    
    return result


def get_redis_client() -> Optional[Redis]:
    """
    Get a Redis client instance for direct usage.
    
    Returns:
        Redis client or None if connection fails
        
    Example:
        >>> redis = get_redis_client()
        >>> if redis:
        ...     redis.set("key", "value")
    """
    redis_host = os.getenv("REDIS_HOST", "localhost")
    redis_port = int(os.getenv("REDIS_PORT", 6379))
    
    return create_redis_client(host=redis_host, port=redis_port)
