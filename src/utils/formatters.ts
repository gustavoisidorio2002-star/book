export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatInstallment(price: number, installments: number): string {
  const value = price / installments;
  return `${installments}x de ${formatBRL(value)} sem juros`;
}
