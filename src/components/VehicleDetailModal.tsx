
import { VehicleData } from "@/types/VehicleData";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import VehicleDetail from "./VehicleDetail";

interface VehicleDetailModalProps {
  vehicle: VehicleData;
  onClose: () => void;
}

const VehicleDetailModal = ({ vehicle, onClose }: VehicleDetailModalProps) => {
  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogOverlay className="bg-black/50" />
      <DialogContent className="max-w-md p-0 border-none bg-transparent shadow-none">
        <VehicleDetail vehicle={vehicle} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default VehicleDetailModal;
