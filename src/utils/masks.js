export const maskCPF = (value) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

export const maskCNPJ = (value) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

export const maskPhone = (value) => {
  if (!value) return "";
  const r = value.replace(/\D/g, "").slice(0, 11);
  if (r.length > 10) return `(${r.slice(0, 2)}) ${r.slice(2, 7)}-${r.slice(7)}`;
  if (r.length > 6) return `(${r.slice(0, 2)}) ${r.slice(2, 6)}-${r.slice(6)}`;
  if (r.length > 2) return `(${r.slice(0, 2)}) ${r.slice(2)}`;
  if (r.length > 0) return `(${r}`;
  return r;
};

export const maskCEP = (value) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{3})\d+?$/, '$1');
};

export const maskTime = (value) => {
  // Se for apenas numeros, formata como "00h" ou "00:00"
  // Seguindo o exemplo do usuario "4h"
  let r = value.replace(/\D/g, '');
  if (r.length > 4) r = r.slice(0, 4);
  
  if (r.length === 0) return '';
  if (r.length <= 2) return r + 'h';
  
  // Se tiver mais de 2, assume formato HH:mm ou similar, mas o usuario deu exemplo "4h"
  // Vou manter flexivel: se digitar "4" vira "4h". Se digitar "0430" vira "04:30h"
  if (r.length > 2) {
    return r.slice(0, 2) + ':' + r.slice(2) + 'h';
  }
  return r + 'h';
};

export const capitalize = (value) => {
  if (!value) return '';
  return value.replace(/(^\w|\s\w)/g, m => m.toUpperCase());
};
