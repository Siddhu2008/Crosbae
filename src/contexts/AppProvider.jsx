import React from "react";
import { ProductProvider } from "./ProductContext";
import { BrandProvider } from "./BrandContext";
import { CategoryProvider } from "./CategoryContext";
import { PurityProvider } from "./PurityContext";
import { MetalTypeProvider } from "./MetalTypeContext";
import { StoneTypeProvider } from "./StoneTypeContext";

export default function AppProvider({ children }) {
  return (
    <BrandProvider>
      <CategoryProvider>
        <PurityProvider>
          <MetalTypeProvider>
            <StoneTypeProvider>
              <ProductProvider>{children}</ProductProvider>
            </StoneTypeProvider>
          </MetalTypeProvider>
        </PurityProvider>
      </CategoryProvider>
    </BrandProvider>
  );
}
