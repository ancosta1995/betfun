import { styled } from "@material-ui/core/styles";
import { motion } from "framer-motion";

// Overlay component
export const Overlay = styled(motion.div)({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 999,
});

// Modal component styled
export const StyledModal = styled(motion.div)({
  backgroundColor: "#131426",
  borderRadius: "12px",
  padding: "0",
  maxHeight: "min(100vh - 20px, 800px)",
  maxWidth: "min(90vw, 33.75rem)",
  color: "white",
  overflowY: "auto",
  minWidth: "31rem",
  width: "100%",
  zIndex: 1000,
  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
});

// Modal body component
export const ModalBody = styled("div")({
  flex: 1,
  padding: "24px",
}); 