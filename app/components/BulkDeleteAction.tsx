"use client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash } from "lucide-react";
import { deleteEntities } from "@/app/actions/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import TranslatedHeader from "@/app/components/TranslatedHeader";

interface BulkDeleteActionProps {
  selectedIds: string[];
  entity: string;
}

export function BulkDeleteAction({ selectedIds, entity }: BulkDeleteActionProps) {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const res = await deleteEntities(entity, selectedIds);
      if (res) {
        toast.success(<TranslatedHeader title="dashboard.common.deleteSuccess" />);
        router.refresh();
      } else {
        toast.error(<TranslatedHeader title="dashboard.common.deleteError" />);
      }
    } catch (error) {
      toast.error(<TranslatedHeader title="dashboard.common.deleteError" />);
      console.error(error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="ml-auto">
          <Trash className="h-4 w-4 mr-2" />
          <TranslatedHeader title="dashboard.common.deleteSelected" /> ({selectedIds.length})
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <TranslatedHeader title="dashboard.common.areYouSure" />
          </AlertDialogTitle>
          <AlertDialogDescription>
            <TranslatedHeader
              title="dashboard.common.deleteMultipleWarning"
              values={{ count: selectedIds.length, entity: entity.toLowerCase() }}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            <TranslatedHeader title="dashboard.common.cancel" />
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>
            <TranslatedHeader title="dashboard.common.delete" />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
