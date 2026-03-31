import { useMutation, useQueryClient } from '@tanstack/react-query';
import { workspaceService } from '@/services/api';

/**
 * Custom hook to encapsulate workspaceAPI interactions.
 * It strictly types the execution and manages React Query cache invalidations
 * automatically, freeing the UI components from handling raw promises.
 */
export const useWorkspace = () => {
    const queryClient = useQueryClient();

    const executeWorkflowMutation = useMutation({
        mutationFn: async (workflowId: number) => {
            return await workspaceService.executeWorkflow(workflowId);
        },
        onSuccess: () => {
            // Trigger cache invalidation if using react-query for fetching workflows
            queryClient.invalidateQueries({ queryKey: ['workspace'] });
        },
        onError: (error) => {
            console.error('Failed to execute workflow:', error);
            // Can be expanded to trigger toast notifications
        }
    });

    return {
        executeWorkflow: executeWorkflowMutation.mutate,
        executeWorkflowAsync: executeWorkflowMutation.mutateAsync,
        isExecuting: executeWorkflowMutation.isPending,
        error: executeWorkflowMutation.error
    };
};
