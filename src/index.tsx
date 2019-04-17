import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './gcube.min.js';
import './style.css';

const checkSymbol = (v: string) => {
  switch (v.slice(0, 1)) {
    case 'R': case 'L': case 'F': case 'B': case 'U': case 'D':
    case 'M': case 'S': case 'E': case 'X': case 'Y': case 'Z':
      return v
  }
  return ''
}

const convertW = (v: string) => {
  const a = v.slice(0, 1)
  const b = v.slice(2, 3)
  switch (a) {
    case 'R':
      return [a, "M'"].map(w => w + b)
    case 'L':
      return [a, 'M'].map(w => w + b)
    case 'F':
      return [a, 'S'].map(w => w + b)
    case 'B':
      return [a, "S'"].map(w => w + b)
    case 'U':
      return [a, 'E'].map(w => w + b)
    case 'D':
      return [a, "E'"].map(w => w + b)
  }
  return [v]
}

const changeRotat = (t: string) => {
  const T: Array<string> = []
  t.toUpperCase()
  .split(' ')
  .map(v => checkSymbol(v))
  .map(v => v.slice(1, 2) == 'W' ? convertW(v) : [v])
  .forEach(v => T.push(...v))

  $('g-cube').gscramble(
    T
    .map(v => v.slice(1, 2) == '3' ? `${v.slice(0, 1)}'` : v)
    .map(v => v.slice(2, 3) == '3' ? `${v.slice(0, 1)}`  : v)
    .map(v => v.slice(2, 3) == "'" ? `${v.slice(0, 1)}`  : v)
    .join(' ')
  )
}

class InputArea extends React.Component<{}, {solveSymbol: string}> {
  constructor(props: any) {
    super(props)
    this.state = {solveSymbol: ''}
    this.changeSolveSymbol = this.changeSolveSymbol.bind(this)
    this.checkEnter = this.checkEnter.bind(this)
    this.submit = this.submit.bind(this)
  }

  changeSolveSymbol = (e: any) => this.setState({solveSymbol: e.target.value})

  checkEnter = (e: any) => e.key === 'Enter' ? this.submit() : null

  submit = () => {
    changeRotat(this.state.solveSymbol)
    this.setState({solveSymbol: ''})
  }

  render = () => (
    <div id='inputArea'>
      <input type='text' name='solveSymbol' className='symbolText' value={this.state.solveSymbol} onChange={this.changeSolveSymbol} onKeyDown={this.checkEnter} />
      <a className='btn' onClick={this.submit}>submit</a>
    </div>
  )
}

const Content = () => (
  <div>
    <a href='https://tribox.com/3x3x3/solution/notation/' target='_blank'>回転記号一覧</a>
    <InputArea />
  </div>
)

ReactDOM.render(
  <Content />,
  document.getElementById('root')
)
