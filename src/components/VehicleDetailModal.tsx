
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
      <DialogOverlay className="fixed inset-0 bg-black/50 z-40" />
      <DialogContent 
        className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] p-0 border-none bg-transparent shadow-none" 
        aria-describedby="vehicle-detail-description"
      >
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
