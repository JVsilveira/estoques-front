import './Home.css';

function Home() {
  return (
    <div className='Home'>
      <div className="quantidades">
        <div className="titulo">ESTOQUE ARKLOK TIM</div>
          <div className="ativos">
            <div className="tabelas-container">            
              <table className='tabela'>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantidade</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Teclado com fio</td>
                  <td><input type="number" value="0" readOnly /></td>
                </tr>
                <tr>
                  <td>Mouse com fio</td>
                  <td><input type="number" value="0" readOnly /></td>
                </tr>
                <tr>
                  <td>Teclado/Mouse com fio</td>
                  <td><input type="number" value="0" readOnly /></td>
                </tr>
                <tr>
                  <td>Mochila</td>
                  <td><input type="number" value="0" readOnly /></td>
                </tr>
                <tr>
                  <td>Suporte Ergonômico</td>
                  <td><input type="number" value="0" readOnly /></td>
                </tr>
                <tr>
                  <td>Headset Bilateral</td>
                  <td><input type="number" value="0" readOnly /></td>
                </tr>
                <tr>
                  <td>Headset Unilateral</td>
                  <td><input type="number" value="0" readOnly /></td>
                </tr>
             </tbody>
            </table>
          <table className='tabela'>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantidade</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Cabo de segurança</td>
                  <td><input type="number" value="0" readOnly /></td>
                </tr>
                <tr>
                  <td>HUB usb</td>
                  <td><input type="number" value="0" readOnly /></td>
                </tr>
                <tr>
                  <td>Dockstation</td>
                  <td><input type="number" value="0" readOnly /></td>
                </tr>
                <tr>
                  <td>Headset premium</td>
                  <td><input type="number" value="0" readOnly /></td>
                </tr>
                <tr>
                  <td>Webcam</td>
                  <td><input type="number" value="0" readOnly /></td>
                </tr>
                <tr>
                  <td>Mouse sem fio</td>
                  <td><input type="number" value="0" readOnly /></td>
                </tr>
                <tr>
                  <td>Teclado sem fio</td>
                  <td><input type="number" value="0" readOnly /></td>
                </tr>
             </tbody>
            </table>
             <table className='tabela'>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantidade</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Lenovo T14</td>
                  <td><input type="number" value="0" readOnly /></td>
                </tr>
                <tr>
                  <td>Lenovo M80Q</td>
                  <td><input type="number" value="0" readOnly /></td>
                </tr>
                <tr>
                  <td>Lenovo S22E</td>
                  <td><input type="number" value="0" readOnly /></td>
                </tr>
                <tr>
                  <td>Lenovo T22</td>
                  <td><input type="number" value="0" readOnly /></td>
                </tr>
                <tr>
                  <td>Dell P2422H</td>
                  <td><input type="number" value="0" readOnly /></td>
                </tr>
                </tbody>
            </table>
            </div>
            </div>
      </div>
    </div>
  );
}

export default Home;