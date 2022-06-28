const MAX_ROW = 5
const data = new Array(MAX_ROW ** 2).fill(0)
const { stage, logs } = createStage()
let records = []

function createStage() {
  const stage = document.createElement('div')
  stage.className = 'container'
  document.body.append(stage)
  const df = document.createDocumentFragment()
  data.forEach((state, idx) => {
    const dom = document.createElement('div')
    dom.className = 'item'
    dom.style.cssText = `width:${100 / MAX_ROW}%;height:${100 / MAX_ROW}%`
    dom.dataset.state = state
    dom.onclick = () => switchItem(idx)
    df.appendChild(dom)
  })
  stage.appendChild(df)

  const logs = document.createElement('div')
  logs.className = 'logs'
  document.body.appendChild(logs)

  const btnGroup = document.createElement('div')
  const replayBtn = document.createElement('button')
  replayBtn.innerText = '播放历史操作'
  replayBtn.onclick = replay
  btnGroup.appendChild(replayBtn)

  const resetBtn = document.createElement('button')
  resetBtn.innerText = '重置'
  resetBtn.onclick = reset
  btnGroup.appendChild(resetBtn)
  document.body.appendChild(btnGroup)

  return { stage, logs }
}

function render() {
  Array.from(stage.children).forEach((el, idx) => {
    el.setAttribute('data-state', data[idx] + '')
  })
  logs.innerText = `步数：${records.length} ${records.slice(-10)}`
}

function switchItem(idx) {
  const position = getTRBLIndex(idx)
  position.forEach((i) => {
    data[i] = 1 - data[i]
  })
  records.push(idx)
  render()
}

function getTRBLIndex(idx) {
  const top = idx >= MAX_ROW ? idx - MAX_ROW : null
  const right = (idx % MAX_ROW) + 1 >= MAX_ROW ? null : idx + 1
  const bottom = idx + MAX_ROW < MAX_ROW ** 2 ? idx + MAX_ROW : null
  const left = (idx % MAX_ROW) - 1 >= 0 ? idx - 1 : null

  return [top, right, bottom, left, idx]
}

function reset() {
  data.fill(0)
  records = []
  render()
}

function replay() {
  data.fill(0)
  const newRecords = [...records]
  records = []

  render()
  
  for (let i = 0; i < newRecords.length; i++) {
    setTimeout(() => {
      switchItem(newRecords[i])
    }, (i + 1) * 700)
  }
}
