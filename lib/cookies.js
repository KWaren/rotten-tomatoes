function parseCookies(cookieHeader) {
  if (!cookieHeader) return {};
  return cookieHeader.split(';').map(s => s.trim()).reduce((acc, part) => {
    const [k, ...v] = part.split('=');
    acc[k] = decodeURIComponent(v.join('='));
    return acc;
  }, {});
}
export default { parseCookies };
