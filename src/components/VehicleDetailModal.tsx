
import { VehicleData } from "@/types/VehicleData";
import { 
  Dialog, 
  DialogContent, 
  DialogOverlay, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import VehicleDetail from "./VehicleDetail";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface VehicleDetailModalProps {
  vehicle: VehicleData;
  onClose: () => void;
}

const VehicleDetailModal = ({ vehicle, onClose }: VehicleDetailModalProps) => {
  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogOverlay className="bg-black/50" />
      <DialogContent className="max-w-md p-0 border-none bg-transparent shadow-none" aria-describedby="vehicle-detail-description">
        <VisuallyHidden>
          <DialogTitle>Vehicle Details for {vehicle.lorry}</DialogTitle>
          <DialogDescription id="vehicle-detail-description">
            Detailed information about vehicle {vehicle.lorry} including route data and electrification readiness
          </DialogDescription>
        </VisuallyHidden>
        <VehicleDetail vehicle={vehicle} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default VehicleDetailModal;
