import type { Platba, Predpis } from '../types';

export function calculateTenantBalance(
  najemnikId: string,
  platby: Platba[],
  predpisy: Predpis[]
): number {
  // Get all payments for the tenant (excluding security deposit)
  const najemnikovyPlatby = platby
    .filter(platba => platba.najemnikId === najemnikId)
    .reduce((sum, platba) => sum + platba.castkaNajem + platba.castkaPoplatky, 0);

  // Get all invoices for the tenant
  const predepsanaCastka = predpisy
    .filter(predpis => predpis.najemnikId === najemnikId)
    .reduce((sum, predpis) => {
      const now = new Date();
      const platnostOd = new Date(predpis.platnostOd);
      const platnostDo = new Date(predpis.platnostDo);
      
      // Only count if the invoice is currently valid
      if (now >= platnostOd && now <= platnostDo) {
        return sum + predpis.mesicniNajem + predpis.zalohaSluzby;
      }
      return sum;
    }, 0);

  // Return the difference (positive means tenant owes money, negative means they have credit)
  return predepsanaCastka - najemnikovyPlatby;
}