(()=>{"use strict";const e=document.querySelectorAll("a");let t;try{t=(()=>{const e=new URLSearchParams(window.location.search).get("epci_id");if(!e)throw new Error("Parameter epci_id is empty.");return e})()}catch(e){t="test"}for(let i of e){let e=i.href;e.includes("mailto:")||e.includes("epci_id")||(e=e.includes("?")?`${e}&epci_id=${t}`:`${e}?epci_id=${t}`,i.href=e)}})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90ZXJyaXRvaXJlc2VudHJhbnNpdGlvbnMuZnIvLi9zcmMvYXBpL2N1cnJlbnRFcGNpLnRzIiwid2VicGFjazovL3RlcnJpdG9pcmVzZW50cmFuc2l0aW9ucy5mci8uL3NyYy9uYXZpZ2F0aW9uLnRzIl0sIm5hbWVzIjpbImRvY3VtZW50IiwicXVlcnlTZWxlY3RvckFsbCIsImVwY2lJZCIsImlkIiwiVVJMU2VhcmNoUGFyYW1zIiwid2luZG93IiwibG9jYXRpb24iLCJzZWFyY2giLCJnZXQiLCJFcnJvciIsImdldEN1cnJlbnRFcGNpSWQiLCJfIiwiYW5jaG9yIiwiaHJlZiIsImluY2x1ZGVzIl0sIm1hcHBpbmdzIjoibUJBQU8sTUNHRCxFQUFVQSxTQUFTQyxpQkFBb0MsS0FDN0QsSUFBSUMsRUFDSixJQUNJQSxFRE40QixNQUM1QixNQUNNQyxFQURZLElBQUlDLGdCQUFnQkMsT0FBT0MsU0FBU0MsUUFDakNDLElBQUksV0FFekIsSUFBS0wsRUFDRCxNQUFNLElBQUlNLE1BQU0sK0JBR3BCLE9BQU9OLEdDRkVPLEdBQ1gsTUFBT0MsR0FDTFQsRUFBUyxPQU1iLElBQUssSUFBSVUsS0FBVSxFQUFTLENBQ3hCLElBQUlDLEVBQU9ELEVBQU9DLEtBQ2RBLEVBQUtDLFNBQVMsWUFDZEQsRUFBS0MsU0FBUyxhQUVNRCxFQUFwQkEsRUFBS0MsU0FBUyxLQUFhLEdBQUdELGFBQWdCWCxJQUN0QyxHQUFHVyxhQUFnQlgsSUFFL0JVLEVBQU9DLEtBQU9BLEsiLCJmaWxlIjoibmF2aWdhdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBnZXRDdXJyZW50RXBjaUlkID0gKCk6IHN0cmluZyA9PiB7XHJcbiAgICBjb25zdCB1cmxQYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpXHJcbiAgICBjb25zdCBpZCA9IHVybFBhcmFtcy5nZXQoJ2VwY2lfaWQnKVxyXG5cclxuICAgIGlmICghaWQpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1BhcmFtZXRlciBlcGNpX2lkIGlzIGVtcHR5LicpXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGlkXHJcbn0iLCJpbXBvcnQge2dldEN1cnJlbnRFcGNpSWR9IGZyb20gXCIuL2FwaS9jdXJyZW50RXBjaVwiO1xyXG5cclxuXHJcbmNvbnN0IGFuY2hvcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxBbmNob3JFbGVtZW50PignYScpXHJcbmxldCBlcGNpSWQ6IHN0cmluZ1xyXG50cnkge1xyXG4gICAgZXBjaUlkID0gZ2V0Q3VycmVudEVwY2lJZCgpXHJcbn0gY2F0Y2ggKF8pIHtcclxuICAgIGVwY2lJZCA9ICd0ZXN0J1xyXG59XHJcblxyXG4vKipcclxuICogSW5qZWN0IGVwY2lfaWQgcGFyYW1ldGVyIGluIGFuY2hvcnMgaHJlZiBpZiBtaXNzaW5nLlxyXG4gKi9cclxuZm9yIChsZXQgYW5jaG9yIG9mIGFuY2hvcnMpIHtcclxuICAgIGxldCBocmVmID0gYW5jaG9yLmhyZWZcclxuICAgIGlmIChocmVmLmluY2x1ZGVzKCdtYWlsdG86JykpIGNvbnRpbnVlXHJcbiAgICBpZiAoaHJlZi5pbmNsdWRlcygnZXBjaV9pZCcpKSBjb250aW51ZVxyXG5cclxuICAgIGlmIChocmVmLmluY2x1ZGVzKCc/JykpIGhyZWYgPSBgJHtocmVmfSZlcGNpX2lkPSR7ZXBjaUlkfWBcclxuICAgIGVsc2UgaHJlZiA9IGAke2hyZWZ9P2VwY2lfaWQ9JHtlcGNpSWR9YFxyXG5cclxuICAgIGFuY2hvci5ocmVmID0gaHJlZlxyXG59XHJcblxyXG4iXSwic291cmNlUm9vdCI6IiJ9