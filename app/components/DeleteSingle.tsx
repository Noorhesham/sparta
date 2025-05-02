"use client";

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
import { Button } from "@/components/ui/button";
import { deleteEntity } from "@/app/actions/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import TranslatedHeader from "./TranslatedHeader";

interface DeleteSingleProps {
  data: {
    _id: string;
  };
  entity: string;
}

export default function DeleteSingle({ data, entity }: DeleteSingleProps) {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const res = await deleteEntity(entity, data._id);
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
      <AlertDialogTrigger asChild onClick={(e) => e.stopPropagation()}>
        <Button variant="ghost" className="w-full justify-start p-0 text-red-600 cursor-pointer">
          <TranslatedHeader title="dashboard.common.delete" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <TranslatedHeader title="dashboard.common.confirmDelete" />
          </AlertDialogTitle>
          <AlertDialogDescription>
            <TranslatedHeader title="dashboard.common.deleteWarning" />
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
