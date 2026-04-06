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
  let r = value.replace(/\D/g, '');
  if (r.length > 11) r = r.slice(0, 11);
  if (r.length > 10) {
    r = r.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
  } else if (r.length > 5) {
    r = r.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
  } else if (r.length > 2) {
    r = r.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
  } else if (r.length > 0) {
    r = r.replace(/^(\d*)/, '($1');
  }
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
