import { ReportType } from "@/types/TypeInterfaces";
import { create } from "zustand";
import { toast } from "sonner";
import api from "@/config/axios";

interface createReportProp {
    targetId?: string,
    reason: string,
    type: ReportType,
    reportedId: string,
}

interface UserReportStore {
    createReport: ({ reason, reportedId, targetId, type }: createReportProp) => Promise<void>;
    isLoading: boolean;
}

export const ToolsStore = create<UserReportStore>((set) => ({
    isLoading: false,
    createReport: async ({ reason, reportedId, targetId, type }: createReportProp) => {
        set({ isLoading: true });
        try {
            await api.post(`/feature/report`, {
                reason,
                type,
                targetId,
                reportedId
            })

            toast.success("Reported successfully");
        } catch (error: any) {
            toast.error("Failed to report");
            console.log(error.response.data.error);

        } finally {
            set({ isLoading: false });
        }
    },
}));

export const useVideoPlayerStore = create(() => ({

}));