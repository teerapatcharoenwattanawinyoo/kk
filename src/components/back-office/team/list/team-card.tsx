import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useDeleteTeam } from "@/hooks/use-teams";
import { useI18n } from "@/lib/i18n";
import { TeamCardProps } from "@/lib/schemas/team";
import {
  Edit,
  Eye,
  Info,
  Layers,
  Loader2,
  MoreVertical,
  Trash2,
  Users,
  Wallet,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const TeamCard = ({ team }: TeamCardProps) => {
  const { t } = useI18n();
  const router = useRouter();
  const params = useParams();
  const deleteTeamMutation = useDeleteTeam();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleViewTeam = () => {
    router.push(`/${params.locale}/team/${team.id}/overview`);
  };

  const handleEditTeam = () => {
    router.push(`/${params.locale}/team/${team.id}/settings`);
  };

  const handleDeleteTeam = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTeamMutation.mutateAsync(team.id);

      // แสดง success toast หลังจากลบสำเร็จ
      setTimeout(() => {
        toast.success(`Team "${team.name}" ถูกลบเรียบร้อยแล้ว`);
      }, 100);

      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting team:", error);
      toast.error("เกิดข้อผิดพลาดในการลบ Team กรุณาลองอีกครั้ง");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card
      className={`min-h-[180px] w-full overflow-hidden bg-background px-3 transition-shadow duration-200 ${
        isDeleting || deleteTeamMutation.isPending
          ? "pointer-events-none opacity-50"
          : ""
      }`}
    >
      <CardHeader className="flex flex-row space-y-2 px-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Avatar className="h-8 w-8 flex-shrink-0 sm:h-10 sm:w-10">
            {team.logoUrl && <AvatarImage src={team.logoUrl} alt={team.name} />}
            <AvatarFallback className="bg-primary-soft text-primary-badge rounded-full font-medium">
              {team.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-title-onecharge truncate text-sm font-semibold sm:text-base">
              {team.name}
            </CardTitle>
            <p className="text-muted-blue truncate text-xs">
              {t("team.team_id")}: {team.id}
            </p>
          </div>
        </div>
        <div className="flex flex-shrink-0 items-center justify-end gap-2">
          <div className="text-right">
            <div className="inline-flex items-start gap-1 rounded-md bg-primary px-3 py-1 text-white sm:px-3 sm:py-1.5">
              <div>
                <Wallet className="size-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs">{t("team.wallet")}</span>
                <div className="text-xs font-semibold sm:text-sm">
                  <span className="hidden sm:inline">
                    {team.wallet.toLocaleString("en-US", {
                      minimumFractionDigits: 0,
                    })}{" "}
                    ฿
                  </span>
                  <span className="sm:hidden">
                    {team.wallet >= 1000000
                      ? `${(team.wallet / 1000000).toFixed(1)}M฿`
                      : team.wallet >= 1000
                        ? `${(team.wallet / 1000).toFixed(0)}K฿`
                        : `${team.wallet}฿`}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 flex-shrink-0 sm:h-8 sm:w-8"
              >
                <MoreVertical className="text-p-onecharge h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={handleEditTeam}>
                <Edit className="h-3.5 w-3.5" />
                {t("buttons.edit")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={
                  isDeleting || deleteTeamMutation.isPending
                    ? () => {}
                    : handleDeleteTeam
                }
                variant="destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {isDeleting ? t("buttons.deleting") : t("buttons.delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="space-y-3 px-0 pb-0">
        <div className="flex items-center pl-2 text-xs sm:text-sm">
          <div className="flex min-w-0 items-center gap-1 sm:gap-2">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center">
              <Users className="text-p-onecharge h-4 w-4" />
            </div>
            <span className="text-p-onecharge flex-shrink-0">
              {t("team.members")}:
            </span>
            <span className="font-semibold text-primary">{team.members}</span>
          </div>
        </div>
        <Separator />
        <div className="relative grid grid-cols-3 gap-4 text-xs">
          <div className="flex min-w-0 items-center justify-center gap-1">
            <div className="flex h-6 w-6 items-center justify-center rounded-sm">
              <Layers className="text-p-onecharge size-4" />
            </div>
            <div className="text-p-onecharge text-xs leading-none">
              {t("team.stations")}:
            </div>
            <div className="text-xs font-semibold leading-none text-primary">
              {team.stations}
            </div>
          </div>

          <div className="absolute bottom-0 left-1/3 top-0 w-px bg-border" />

          <div className="flex min-w-0 items-center justify-center gap-1">
            <div className="h-3"></div>
            <div className="text-p-onecharge text-xs leading-none">
              {t("team.chargers")}:
            </div>
            <div className="text-xs font-semibold leading-none text-primary">
              {team.chargers}
            </div>
          </div>

          <div className="absolute bottom-0 left-2/3 top-0 w-px bg-border" />

          <div className="flex min-w-0 items-center justify-center gap-1">
            <div className="h-3"></div>
            <div className="text-p-onecharge text-xs leading-none">
              {t("team.connectors")}:
            </div>
            <div className="text-xs font-semibold leading-none text-primary">
              {team.connectors}
            </div>
          </div>
        </div>
        <Separator />
        <div className="flex items-center justify-between pt-2">
          {team.package && (
            <Badge
              variant="secondary"
              className="gap-1 bg-primary/10 px-2 py-2 text-primary"
            >
              <Info />
              {team.package} Package
            </Badge>
          )}

          <Button
            className="ml-auto flex h-6 flex-shrink-0 items-center gap-1 rounded-md px-3 py-4 text-xs"
            variant={"default"}
            onClick={handleViewTeam}
          >
            <Eye className="h-3 w-3" />
            {t("buttons.view")}
          </Button>
        </div>
      </CardContent>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[360px]">
          <DialogHeader>
            <DialogTitle>{t("team.delete_team")}</DialogTitle>
            <DialogDescription>
              {`คุณแน่ใจหรือไม่ที่จะลบ Team "${team.name}"? การดำเนินการนี้ไม่สามารถย้อนกลับได้`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting || deleteTeamMutation.isPending}
            >
              {(isDeleting || deleteTeamMutation.isPending) && (
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}
              Confirm
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting || deleteTeamMutation.isPending}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
