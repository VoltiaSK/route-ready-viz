
import { VehicleData } from "@/types/VehicleData";
import { 
  Dialog, 
  DialogContent, 
  DialogTitle,
  DialogDescription,
  DialogOverlay
} from "@/components/ui/dialog";
import VehicleDetail from "./VehicleDetail";
import { useEffect } from "react";

interface VehicleDetailModalProps {
  vehicle: VehicleData;
  onClose: () => void;
}

const VehicleDetailModal = ({ vehicle, onClose }: VehicleDetailModalProps) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    // Add top-level class for better embedding support
    document.documentElement.classList.add('fleet-viz-modal-open');
    
    return () => {
      document.body.style.overflow = '';
      document.documentElement.classList.remove('fleet-viz-modal-open');
    };
  }, []);
  
  return (
    <Dialog 
      open={true} 
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      modal={true}
    >
      <DialogOverlay className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={onClose} />
      <DialogContent 
        className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] p-0 border-none bg-transparent shadow-none"
        aria-labelledby="vehicle-detail-title" 
        aria-describedby="vehicle-detail-description"
      >
        <DialogTitle id="vehicle-detail-title" className="sr-only">
          Vehicle Details for {vehicle.lorry}
        </DialogTitle>
        <DialogDescription id="vehicle-detail-description" className="sr-only">
          Detailed information about vehicle {vehicle.lorry} including route data and electrification readiness
        </DialogDescription>
        <VehicleDetail vehicle={vehicle} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default VehicleDetailModal;
