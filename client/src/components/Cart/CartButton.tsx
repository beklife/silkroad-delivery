import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCartIcon } from "@/components/icons";
import { useCart } from "@/lib/CartContext";

export default function CartButton() {
  const { totalItems, openCart } = useCart();

  return (
    <motion.button
      onClick={openCart}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative p-2 text-foreground hover:text-primary transition-colors"
      aria-label="Open cart"
    >
      <ShoppingCartIcon className="w-6 h-6" />
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center"
          >
            {totalItems > 9 ? "9+" : totalItems}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
