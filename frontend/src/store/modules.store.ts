import { create } from 'zustand'
import {
    workspaceService,
    clientsService,
    fiscalService,
    payrollService,
    financeService,
    expensesService,
    usersService,
} from '@/services/api'

interface ModulesState {
    // Data
    workspace: { dashboard: any; calendar: any[]; metrics: any; forecast: any; kpiTrends: any[] } | null
    clients: any[]
    fiscal: { deadlines: any[]; deductions: any[]; annualReport: any; opinion: any; coeficiente: any } | null
    payroll: { summary: any; employees: any[]; specialCalcs: any[]; sua: any } | null
    finance: { summary: any; statements: any[]; bankAccounts: any[]; cashFlow: any; chartData: any[] } | null
    expenses: { categories: any[]; pending: any[]; budget: any } | null
    userProfile: any | null
    userSettings: any | null
    fiscalProfiles: any[]
    subscription: any | null

    // Loading
    loading: Record<string, boolean>
    error: string | null

    // Actions
    fetchWorkspace: () => Promise<void>
    createCalendarEvent: (event: any) => Promise<void>
    updateCalendarEvent: (id: number, event: any) => Promise<void>
    deleteCalendarEvent: (id: number) => Promise<void>
    fetchClients: (status?: string, type?: string) => Promise<void>
    createClient: (data: any) => Promise<void>
    updateClient: (id: string, data: any) => Promise<void>
    deleteClient: (id: string) => Promise<void>
    fetchFiscal: () => Promise<void>
    fetchPayroll: () => Promise<void>
    dispersePayroll: () => Promise<any>
    fetchFinance: () => Promise<void>
    reconcileBank: (bankId?: string) => Promise<any>
    fetchExpenses: () => Promise<void>
    classifyExpenses: () => Promise<any>
    fetchUserProfile: () => Promise<void>
    updateUserProfile: (data: any) => Promise<void>
    fetchUserSettings: () => Promise<void>
    updateUserSettings: (data: any) => Promise<void>
    fetchFiscalProfiles: () => Promise<void>
    fetchSubscription: () => Promise<void>
    clearError: () => void
}

export const useModulesStore = create<ModulesState>((set, get) => ({
    workspace: null,
    clients: [],
    fiscal: null,
    payroll: null,
    finance: null,
    expenses: null,
    userProfile: null,
    userSettings: null,
    fiscalProfiles: [],
    subscription: null,
    loading: {},
    error: null,

    fetchWorkspace: async () => {
        set({ loading: { ...get().loading, workspace: true } })
        try {
            const [dashboard, calendar, metrics, forecast, kpiTrends] = await Promise.all([
                workspaceService.getDashboard(),
                workspaceService.getCalendar(),
                workspaceService.getMetrics(),
                workspaceService.getForecast(),
                workspaceService.getKpiTrends(),
            ])
            set({ workspace: { dashboard, calendar, metrics, forecast, kpiTrends }, loading: { ...get().loading, workspace: false } })
        } catch (e: any) {
            set({ error: e.message, loading: { ...get().loading, workspace: false } })
        }
    },

    createCalendarEvent: async (event) => {
        try {
            await workspaceService.createCalendarEvent(event)
            await get().fetchWorkspace()
        } catch (e: any) {
            set({ error: e.message })
        }
    },

    updateCalendarEvent: async (id, event) => {
        try {
            await workspaceService.updateCalendarEvent(id, event)
            await get().fetchWorkspace()
        } catch (e: any) {
            set({ error: e.message })
        }
    },

    deleteCalendarEvent: async (id) => {
        try {
            await workspaceService.deleteCalendarEvent(id)
            await get().fetchWorkspace()
        } catch (e: any) {
            set({ error: e.message })
        }
    },

    fetchClients: async (status?, type?) => {
        set({ loading: { ...get().loading, clients: true } })
        try {
            const clients = await clientsService.list(status, type)
            set({ clients, loading: { ...get().loading, clients: false } })
        } catch (e: any) {
            set({ error: e.message, loading: { ...get().loading, clients: false } })
        }
    },

    createClient: async (data) => {
        try {
            await clientsService.create(data)
            await get().fetchClients()
        } catch (e: any) {
            set({ error: e.message })
        }
    },

    updateClient: async (id, data) => {
        try {
            await clientsService.update(id, data)
            await get().fetchClients()
        } catch (e: any) {
            set({ error: e.message })
        }
    },

    deleteClient: async (id) => {
        try {
            await clientsService.delete(id)
            await get().fetchClients()
        } catch (e: any) {
            set({ error: e.message })
        }
    },

    fetchFiscal: async () => {
        set({ loading: { ...get().loading, fiscal: true } })
        try {
            const [deadlines, deductions, annualReport, opinion, coeficiente] = await Promise.all([
                fiscalService.getDeadlines(),
                fiscalService.getDeductions(),
                fiscalService.getAnnualReport(),
                fiscalService.getComplianceOpinion(''),
                fiscalService.getCoeficiente(),
            ])
            set({ fiscal: { deadlines, deductions, annualReport, opinion, coeficiente }, loading: { ...get().loading, fiscal: false } })
        } catch (e: any) {
            set({ error: e.message, loading: { ...get().loading, fiscal: false } })
        }
    },

    fetchPayroll: async () => {
        set({ loading: { ...get().loading, payroll: true } })
        try {
            const [summary, employees, specialCalcs, sua] = await Promise.all([
                payrollService.getSummary(),
                payrollService.getEmployees(),
                payrollService.getSpecialCalcs(),
                payrollService.getSua(),
            ])
            set({ payroll: { summary, employees, specialCalcs, sua }, loading: { ...get().loading, payroll: false } })
        } catch (e: any) {
            set({ error: e.message, loading: { ...get().loading, payroll: false } })
        }
    },

    dispersePayroll: async () => {
        try {
            const result = await payrollService.disperse()
            await get().fetchPayroll()
            return result
        } catch (e: any) {
            set({ error: e.message })
        }
    },

    fetchFinance: async () => {
        set({ loading: { ...get().loading, finance: true } })
        try {
            const [summary, statements, bankAccounts, cashFlow, chartData] = await Promise.all([
                financeService.getSummary(),
                financeService.getStatements(),
                financeService.getBankAccounts(),
                financeService.getCashFlow(),
                financeService.getChartData(),
            ])
            set({ finance: { summary, statements, bankAccounts, cashFlow, chartData }, loading: { ...get().loading, finance: false } })
        } catch (e: any) {
            set({ error: e.message, loading: { ...get().loading, finance: false } })
        }
    },

    reconcileBank: async (bankId?) => {
        try {
            const result = await financeService.reconcile(bankId)
            await get().fetchFinance()
            return result
        } catch (e: any) {
            set({ error: e.message })
        }
    },

    fetchExpenses: async () => {
        set({ loading: { ...get().loading, expenses: true } })
        try {
            const [categories, pending, budget] = await Promise.all([
                expensesService.getCategories(),
                expensesService.getPending(),
                expensesService.getBudget(),
            ])
            set({ expenses: { categories, pending, budget }, loading: { ...get().loading, expenses: false } })
        } catch (e: any) {
            set({ error: e.message, loading: { ...get().loading, expenses: false } })
        }
    },

    classifyExpenses: async () => {
        try {
            const result = await expensesService.classify()
            await get().fetchExpenses()
            return result
        } catch (e: any) {
            set({ error: e.message })
        }
    },

    fetchUserProfile: async () => {
        try {
            const profile = await usersService.getMe()
            set({ userProfile: profile })
        } catch (e: any) {
            set({ error: e.message })
        }
    },

    updateUserProfile: async (data) => {
        try {
            const profile = await usersService.updateMe(data)
            set({ userProfile: profile })
        } catch (e: any) {
            set({ error: e.message })
        }
    },

    fetchUserSettings: async () => {
        try {
            const settings = await usersService.getSettings()
            set({ userSettings: settings })
        } catch (e: any) {
            set({ error: e.message })
        }
    },

    updateUserSettings: async (data) => {
        try {
            const settings = await usersService.updateSettings(data)
            set({ userSettings: settings })
        } catch (e: any) {
            set({ error: e.message })
        }
    },

    fetchFiscalProfiles: async () => {
        try {
            const profiles = await usersService.getFiscalProfiles()
            set({ fiscalProfiles: profiles })
        } catch (e: any) {
            set({ error: e.message })
        }
    },

    fetchSubscription: async () => {
        try {
            const sub = await usersService.getSubscription()
            set({ subscription: sub })
        } catch (e: any) {
            set({ error: e.message })
        }
    },

    clearError: () => set({ error: null }),
}))
