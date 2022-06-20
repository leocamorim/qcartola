import React, { Component } from "react";
import "reactochart/styles.css";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import Chart from "chart.js/auto";

Array.prototype.groupBy = function (field) {
  let groupedArr = [];
  this.forEach(function (e) {
    //look for an existent group
    let group = groupedArr.find((g) => g["field"] === e[field]);
    if (group == undefined) {
      //add new group if it doesn't exist
      group = { field: e[field], groupList: [] };
      groupedArr.push(group);
    }

    //add the element to the group
    group.groupList.push(e);
  });

  return groupedArr;
};

const _auth_url = "https://login.globo.com/api/authentication";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {
        labels: [],
        datasets: [
          {
            data: [],
          },
        ],
      },
      graficoExibido: "",
      input_email: "leoferruge@gmail.com",
      input_password: "qualidata123",
    };
  }

  componentDidMount() {
    this.buscaDestaques();
  }

  alteraGrafico = (_grafico) => {
    if (this.state.graficoExibido == _grafico)
      this.setState({ graficoExibido: "" });
    else this.setState({ graficoExibido: _grafico });
  };

  buscaDestaques = (_agrupamento = "") => {
    fetch("https://api.cartola.globo.com/mercado/destaques")
      .then((res) => res.json())
      .then((_data) => {
        const finish = {
          labels: [],
          datasets: [
            {
              label: "",
              data: [],
              backgroundColor: "rgba(0, 0, 0, .8)",
            },
          ],
        };
        let result = _data.groupBy(_agrupamento || "clube_nome");
        result.forEach((grupoClube) => {
          let _aux = 0;
          if (!finish.labels.includes(grupoClube.field)) {
            finish.labels.push(grupoClube.field);
          }
          grupoClube.groupList.forEach((destaqueClube) => {
            _aux += destaqueClube.escalacoes;
          });
          finish.datasets[0].data.push(_aux);
        });
        this.setState({
          data: finish,
          graficoExibido: "Bar_" + (_agrupamento || "clube_nome"),
        });
      });
  };

  buscaDestaquesClube(_clube) {
    fetch("https://api.cartola.globo.com/mercado/destaques")
      .then((res) => res.json())
      .then((_data) => {
        const finish = {
          labels: [],
          datasets: [
            {
              label: "",
              data: [],
              backgroundColor: [
                "rgba(255, 99, 132, .8)",
                "rgba(54, 162, 235, .8)",
                "rgba(255, 206, 86, .8)",
                "rgba(75, 192, 192, .8)",
                "rgba(153, 102, 255, .8)",
                "rgba(255, 159, 64, .8)",
                "rgba(255, 99, 132, .8)",
                "rgba(54, 162, 235, .8)",
                "rgba(255, 206, 86, .8)",
                "rgba(75, 192, 192, .8)",
                "rgba(153, 102, 255, .8)",
                "rgba(255, 159, 64, .8)",
                "rgba(255, 99, 132, .8)",
                "rgba(54, 162, 235, .8)",
                "rgba(255, 206, 86, .8)",
                "rgba(75, 192, 192, .8)",
                "rgba(153, 102, 255, .8)",
                "rgba(255, 159, 64, .8)",
              ],
            },
          ],
        };

        _data
          .groupBy("clube_nome")
          .find((el) => {
            return el.field == _clube;
          })
          .groupList.forEach((jogador) => {
            finish.labels.push(jogador.Atleta.apelido);
            finish.datasets[0].data.push(jogador.escalacoes);
          });

        this.setState({
          data: finish,
          graficoExibido: "Doughnut",
        });
      });
  }

  autenticacao = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json", "User-Agent": "PostmanRuntime/7.26.2", "Access-Control-Allow-Origin": "*" },
      body: { 
          email: this.state.input_email,
          password: this.state.input_password,
          serviceId: 4728
        }
    };

    fetch("https://login.globo.com/api/authentication", requestOptions)
      .then((res) => res.json())
      .then((_data) => {
          console.log(_data)
      });
  };

  render() {
    return (
      <div>
        <div className="login">
          <h2>Login area</h2>
          <input
            type="email"
            placeholder="E-mail"
            value={this.state.input_email}
            onInput={(e) => this.setState({ input_email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Senha"
            value={this.state.input_password}
            onInput={(e) => this.setState({ input_password: e.target.value })}
          />
          <button
            type="button"
            onClick={() => {
              this.autenticacao();
            }}
          >
            Entrar
          </button>
        </div>

        <h2>Charts Studies in React-ChartJS-2</h2>

        <div className="botoes">
          <button
            className={`${
              this.state.graficoExibido == "Bar_clube_nome" ? "active" : ""
            }`}
            onClick={() => {
              this.alteraGrafico("Bar_clube_nome");
              this.buscaDestaques();
            }}
          >
            Destaques por Clube
          </button>
          <button
            className={`${
              this.state.graficoExibido == "Bar_posicao" ? "active" : ""
            }`}
            onClick={() => {
              this.alteraGrafico("Bar_posicao");
              this.buscaDestaques("posicao");
            }}
          >
            Destaques por posição
          </button>
          <button
            className={`${
              this.state.graficoExibido == "Doughnut" ? "active" : ""
            }`}
            onClick={() => {
              this.alteraGrafico("Doughnut");
              this.buscaDestaquesClube("Flamengo");
            }}
          >
            Destaques por posição
          </button>
        </div>
        {this.state.graficoExibido == "Bar_clube_nome" && (
          <Bar data={this.state.data} width={100} height={50} />
        )}
        {this.state.graficoExibido == "Bar_posicao" && (
          <Line data={this.state.data} width={100} height={50} />
        )}
        {this.state.graficoExibido == "Doughnut" && (
          <Doughnut data={this.state.data} width={100} height={50} />
        )}
      </div>
    );
  }
}
