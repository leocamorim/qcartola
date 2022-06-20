import './App.css';
import XYPlot from 'reactochart/XYPlot';
import XAxis from 'reactochart/XAxis';
import YAxis from 'reactochart/YAxis';
import LineChart from 'reactochart/LineChart';
import 'reactochart/styles.css';
import Home from './components/Home';
import { Component } from 'react';
import Login from './components/Login';

Array.prototype.groupBy = function (field) {
  let groupedArr = [];
  this.forEach(function (e) {
    let group = groupedArr.find(g => g['field'] === e[field]);
    if (group == undefined) {
      group = { field: e[field], groupList: [] };
      groupedArr.push(group);
    }

    group.groupList.push(e);
  });

  return groupedArr;
}

export class App extends Component {

  constructor(props) {
    
    super(props);

    this.state = {
      data: []
    }
  }

  componentDidMount() {
    // this.chamaApi();
  }

  chamaApi = () => {
    let finish = [];
    fetch("https://api.cartola.globo.com/mercado/destaques")
      .then(res => res.json())
      .then(_data => {
        let result = _data.groupBy('clube');
        let _aux = { x: "", y: 0 }
        result.forEach(grupoClube => {
          _aux = { x: "", y: 0 }
          _aux.x = grupoClube.field;
          grupoClube.groupList.forEach(destaqueClube => {
            _aux.y += destaqueClube.escalacoes;
          });
          finish.push(_aux);
        });
        this.setState({
          data: finish
        })
        console.log(this.state.data)
      })
  }

  render() {
    return (
      <div>
        <Login />
      </div>
    );
  }
}

export default App;
