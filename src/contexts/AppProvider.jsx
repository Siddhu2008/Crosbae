import React from "react";
import { ProductProvider } from "./ProductContext";
import { BrandProvider } from "./BrandContext";
import { CategoryProvider } from "./CategoryContext";
import { PurityProvider } from "./PurityContext";
import { MetalTypeProvider } from "./MetalTypeContext";
import { StoneTypeProvider } from "./StoneTypeContext";
import { CartProvider } from "./CartContext";
import { CertificateProvider } from "./CertificateContext";
import { WishlistProvider } from "./WishlistContext";
import { ReviewProvider } from "./ReviewContext";

export default function AppProvider({ children }) {
  return (
    <BrandProvider>
      <CategoryProvider>
        <CartProvider>
          <WishlistProvider>
          <PurityProvider>
            <CertificateProvider>
              <MetalTypeProvider>
                <StoneTypeProvider>
                  <ReviewProvider>
                    <ProductProvider>{children}</ProductProvider>
                  </ReviewProvider>
                </StoneTypeProvider>
              </MetalTypeProvider>
            </CertificateProvider>
          </PurityProvider>
          </WishlistProvider>
        </CartProvider>
      </CategoryProvider>
    </BrandProvider>
  );
}
