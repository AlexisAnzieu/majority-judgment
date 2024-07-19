const updateMutter = <T>(url: string, { arg }: { arg: T }) =>
  fetch(url, {
    method: "POST",
    body: JSON.stringify(arg),
  }).then((res) => res.json());

const deleteMutter = <T>(url: string, { arg }: { arg: T }) =>
  fetch(url, {
    method: "DELETE",
    body: JSON.stringify(arg),
  }).then((res) => res.json());

export { updateMutter, deleteMutter };
