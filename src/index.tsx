import * as React from 'react'
import * as ReactDOM from 'react-dom'
import './gcube.min.js'
import './style.css'

/**
 * ページのタイトルを表示するコンポーネント
 */
ReactDOM.render(
  <h1>ルービックキューブの手順確認ツール</h1>,
  document.getElementById('title')
)

/**
 * 入力された記号が正しい記号か確認をする
 * @param  {v: string} - 回転記号
 * @return {string}    - 回転記号または空文字
 */
const checkSymbol = (v: string): string => {
  // prettier-ignore
  switch (v.slice(0, 1)) {
    case 'R': case 'L': case 'F': case 'B': case 'U': case 'D':
    case 'M': case 'S': case 'E': case 'X': case 'Y': case 'Z':
      return v
  }
  return ''
}

/**
 * 2文字目にWが来た際、1文字目に対応する値に変更する
 * RW → R M'
 * UW2 → U2 E2
 * @param  {v: string}     - 回転記号
 * @return {Array<string>} - 回転記号の配列
 */
const convertW = (v: string): Array<string> => {
  const a = v.slice(0, 1)
  const b = v.slice(1, 2)
  const c = v.slice(2, 3)

  if (b == 'W') {
    // prettier-ignore
    return [a,
      a == 'R' ? "M'" :
      a == 'L' ? 'M'  :
      a == 'F' ? 'S'  :
      a == 'B' ? "S'" :
      a == 'U' ? 'E'  :
      a == 'D' ? "E'" :
      '',
    ].map(w => w + c)
  }
  return [v]
}

/**
 * 3が来た際のパース処理
 * @param  {v: string} - 回転記号
 * @return {string}    - パースした回転記号
 */
const convert3 = (v: string): string => `${v}2 ${v}`

/**
 * 4が来た際のパース処理
 * @param  {v: string} - 入力された文字列
 * @return {string}    - パースした回転記号
 */
const convert4 = (v: string): string => `${v}2 ${v}2`

/**
 * 入力された文字列を正しい回転記号にパースし、キューブを回転させる
 * @param {s: string} - 入力された文字列
 * {@link https://github.com/molarmanful/gCube gCube}
 */
const changeRotation = (s: string): void => {
  const t: Array<string> = []

  s.toUpperCase()
    .split(' ')
    .map(v => checkSymbol(v))
    .map(v => convertW(v))
    .forEach(v => t.push(...v))

  const u: string = t
    .map(v => (v.slice(1, 2) == '3' ? convert3(v.slice(0, 1)) : v))
    .map(v => (v.slice(1, 2) == '4' ? convert4(v.slice(0, 1)) : v))
    .map(v => (v.slice(2, 3) == '3' ? `${v.slice(0, 1)}` : v))
    .map(v => (v.slice(2, 3) == "'" ? `${v.slice(0, 1)}` : v))
    .join(' ')

  // キューブを回転させる
  $('g-cube').gscramble(u)
}

/**
 * 回転記号の入力を管理するコンポーネント
 */
class InputArea extends React.Component<{}, {solveSymbol: string}> {
  constructor(props: Readonly<{}>) {
    super(props)
    this.state = {solveSymbol: ''}
    this.changeSolveSymbol = this.changeSolveSymbol.bind(this)
    this.checkEnter = this.checkEnter.bind(this)
    this.changeCube = this.changeCube.bind(this)
  }

  // Inputの値を変更する
  changeSolveSymbol = (e: {target: {value: string}}): void =>
    this.setState({solveSymbol: e.target.value})
  // Enterの場合submitする
  checkEnter = (e: {key: string}): void =>
    e.key === 'Enter' ? this.changeCube() : undefined
  // solveSymbolの値でキューブを回転させる、その後solveSymbolを空にする
  changeCube = (): void => {
    changeRotation(this.state.solveSymbol)
    this.setState({solveSymbol: ''})
  }

  render = (): JSX.Element => (
    <div id='inputArea'>
      <input
        type='text'
        name='solveSymbol'
        className='symbolText'
        value={this.state.solveSymbol}
        onChange={this.changeSolveSymbol}
        onKeyDown={this.checkEnter}
      />
      <a className='btn' onClick={this.changeCube}>
        rotation
      </a>
    </div>
  )
}

ReactDOM.render(<InputArea />, document.getElementById('procedureInput'))

/**
 * サイトの説明を表示するコンポーネント
 */
const Description = (): JSX.Element => (
  <div>
    <p>ルービックキューブの手順を確認することができるツールです。</p>
    <p>
      テキストエリアに回転記号を入力し、submitするとルービックキューブが回転します。
    </p>
    <p>スペース区切りで複数入力することもできます。</p>
    <p>
      回転記号はtriboxさんの
      <a href='https://tribox.com/3x3x3/solution/notation/' target='_blank'>
        3x3x3 回転記号
      </a>
      を元にしています。
    </p>
  </div>
)

ReactDOM.render(<Description />, document.getElementById('description'))
