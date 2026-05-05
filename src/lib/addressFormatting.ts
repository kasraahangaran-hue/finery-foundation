import type { Address } from "@/stores/orderStore";

/**
 * Format an Address into one or two display lines for cards/rows.
 */
export function addressCardLines(address: Address): { line1: string; line2?: string } {
  switch (address.type) {
    case "apartment":
      return {
        line1: `${address.fields.building}, ${address.fields.aptNumber}`,
        line2: address.formattedAddress,
      };
    case "villa":
      return {
        line1: `${address.fields.community}, Villa ${address.fields.villaNumber}`,
        line2: address.formattedAddress,
      };
    case "hotel":
      return {
        line1: `${address.fields.hotelName}, Room ${address.fields.roomNumber}`,
        line2: address.formattedAddress,
      };
    case "office":
      return {
        line1: `${address.fields.building}, Office ${address.fields.officeNumber}`,
        line2: address.formattedAddress,
      };
  }
}