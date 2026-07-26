export function PrintButton() {
  return <button className="button button--print" type="button" onClick={() => window.print()}><span aria-hidden="true">▣</span> Imprimir o guardar PDF</button>
}
