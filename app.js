// ============================================================
//  沉香基因 · 核心应用逻辑
// ============================================================

// ---------- 状态管理 ----------
const state = {
  currentQuestion: 0,
  answers: {},          // { questionId: optionId }
  budget: 500,
  budgetTier: 'quality',
  userVector: { sweet: 0, woody: 0, cool: 0, milk: 0, spicy: 0, fruity: 0 },
  resultPersonality: null,
  recommendedProducts: []
}

// ---------- 页面切换 ----------
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'))
  const target = document.getElementById(id)
  target.classList.add('active')
  window.scrollTo(0, 0)
}

// ---------- 开始测试 ----------
function startQuiz() {
  state.currentQuestion = 0
  state.answers = {}
  state.budget = 500
  state.budgetTier = 'quality'
  state.userVector = { sweet: 0, woody: 0, cool: 0, milk: 0, spicy: 0, fruity: 0 }
  renderQuestion()
  showPage('page-quiz')
}

// ---------- 渲染问题 ----------
function renderQuestion() {
  const q = QUESTIONS[state.currentQuestion]
  const body = document.getElementById('quiz-body')
  const fill = document.getElementById('progress-fill')
  const text = document.getElementById('progress-text')
  const btnNext = document.getElementById('btn-next')

  // 更新进度
  const pct = ((state.currentQuestion + 1) / QUESTIONS.length) * 100
  fill.style.width = pct + '%'
  text.textContent = `${state.currentQuestion + 1} / ${QUESTIONS.length}`

  // 重置下一步按钮
  btnNext.disabled = !state.answers[q.id] && q.type !== 'budget'
  if (q.type === 'budget') btnNext.disabled = false

  // 渲染问题内容
  if (q.type === 'budget') {
    body.innerHTML = renderBudgetQuestion(q)
    updateBudgetDisplay(state.budget)
  } else {
    body.innerHTML = renderSingleQuestion(q)
    // 恢复已选
    if (state.answers[q.id]) {
      const el = document.querySelector(`[data-id="${state.answers[q.id]}"]`)
      if (el) el.classList.add('selected')
    }
  }
}

function renderSingleQuestion(q) {
  const isColor = q.optionType === 'color'
  const optionsHtml = q.options.map(opt => {
    if (isColor) {
      return `
        <div class="option-card color-option" data-id="${opt.id}" onclick="selectOption('${q.id}', '${opt.id}', this)">
          <div class="color-swatch" style="background: ${opt.color}"></div>
          <div class="option-label">${opt.label}</div>
          <div class="option-desc">${opt.desc}</div>
          <div class="option-check">✓</div>
        </div>`
    }
    return `
      <div class="option-card" data-id="${opt.id}" onclick="selectOption('${q.id}', '${opt.id}', this)">
        <div class="option-emoji">${opt.emoji}</div>
        <div class="option-text">
          <div class="option-label">${opt.label}</div>
          <div class="option-desc">${opt.desc}</div>
        </div>
        <div class="option-check">✓</div>
      </div>`
  }).join('')

  return `
    <div class="question-card">
      <div class="question-step">${q.step}</div>
      <div class="question-title">${q.title}</div>
      <div class="question-subtitle">${q.subtitle}</div>
      <div class="options-grid ${q.layout}">${optionsHtml}</div>
    </div>`
}

function renderBudgetQuestion(q) {
  const tiersHtml = q.tiers.map(t => `
    <div class="budget-tier ${state.budgetTier === t.id ? 'active' : ''}"
         data-tier="${t.id}"
         onclick="selectBudgetTier('${t.id}')">
      <div>${t.label}</div>
      <div style="font-size:10px;margin-top:2px">${t.desc}</div>
    </div>`).join('')

  return `
    <div class="question-card">
      <div class="question-step">${q.step}</div>
      <div class="question-title">${q.title}</div>
      <div class="question-subtitle">${q.subtitle}</div>
      <div class="budget-section">
        <div class="budget-display">
          <span class="budget-amount" id="budget-amount">¥${state.budget}</span>
          <span class="budget-unit">元左右</span>
          <div class="budget-label" id="budget-label-text">品质生活型</div>
        </div>
        <input type="range" id="budget-slider"
               min="50" max="5000" step="50"
               value="${state.budget}"
               oninput="updateBudgetDisplay(this.value)" />
        <div class="budget-tiers" id="budget-tiers">${tiersHtml}</div>
      </div>
    </div>`
}

// ---------- 选择选项 ----------
function selectOption(questionId, optionId, el) {
  // 清除同组选中
  el.closest('.options-grid').querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'))
  el.classList.add('selected')
  state.answers[questionId] = optionId
  document.getElementById('btn-next').disabled = false

  // 微震动反馈
  el.style.transform = 'scale(0.97)'
  setTimeout(() => el.style.transform = '', 150)
}

// ---------- 预算滑块 ----------
function updateBudgetDisplay(val) {
  state.budget = parseInt(val)
  const el = document.getElementById('budget-amount')
  const labelEl = document.getElementById('budget-label-text')
  if (el) el.textContent = '¥' + Number(val).toLocaleString()

  const q = QUESTIONS.find(q => q.id === 'budget')
  let matchedTier = q.tiers[0]
  for (const t of q.tiers) {
    if (state.budget >= t.min) matchedTier = t
  }
  state.budgetTier = matchedTier.id
  if (labelEl) labelEl.textContent = matchedTier.label + '型'

  // 更新tier高亮
  document.querySelectorAll('.budget-tier').forEach(t => {
    t.classList.toggle('active', t.dataset.tier === matchedTier.id)
  })

  // 同步滑块
  const slider = document.getElementById('budget-slider')
  if (slider && parseInt(slider.value) !== state.budget) slider.value = val
}

function selectBudgetTier(tierId) {
  const q = QUESTIONS.find(q => q.id === 'budget')
  const tier = q.tiers.find(t => t.id === tierId)
  if (!tier) return
  const midVal = Math.round((tier.min + tier.max) / 2 / 50) * 50 || tier.min + 100
  updateBudgetDisplay(midVal)
}

// ---------- 下一题 ----------
function nextQuestion() {
  if (state.currentQuestion < QUESTIONS.length - 1) {
    state.currentQuestion++
    renderQuestion()
  } else {
    showLoading()
  }
}

function goBack() {
  if (state.currentQuestion > 0) {
    state.currentQuestion--
    renderQuestion()
  } else {
    showPage('page-welcome')
  }
}

// ---------- 加载动画 ----------
function showLoading() {
  const body = document.getElementById('quiz-body')
  const footer = document.querySelector('.quiz-footer')
  footer.style.display = 'none'

  const msgs = [
    '🔍 正在分析你的香气基因...',
    '🌿 匹配最适合你的沉香...',
    '✨ 生成专属香气身份卡...'
  ]
  let i = 0
  body.innerHTML = `
    <div class="loading-wrap">
      <div class="loading-dots">
        <div class="loading-dot"></div>
        <div class="loading-dot"></div>
        <div class="loading-dot"></div>
      </div>
      <div class="loading-text" id="loading-msg">${msgs[0]}</div>
    </div>`

  const interval = setInterval(() => {
    i = (i + 1) % msgs.length
    const el = document.getElementById('loading-msg')
    if (el) el.textContent = msgs[i]
  }, 900)

  setTimeout(() => {
    clearInterval(interval)
    footer.style.display = ''
    computeResult()
    renderResult()
    showPage('page-result')
  }, 2800)
}

// ============================================================
//  推荐算法引擎
// ============================================================

function computeResult() {
  // 1. 聚合用户向量（加权平均）
  const weights = { mood: 0.3, color: 0.2, scene: 0.2, music: 0.15, budget: 0.0 }
  const dims = Object.keys(state.userVector)

  dims.forEach(d => state.userVector[d] = 0)

  let totalW = 0
  QUESTIONS.forEach(q => {
    if (q.type === 'budget') return
    const w = weights[q.id] || 0.15
    const answerId = state.answers[q.id]
    if (!answerId) return
    const opt = q.options.find(o => o.id === answerId)
    if (!opt || !opt.vector) return
    dims.forEach(d => {
      state.userVector[d] += (opt.vector[d] || 0) * w
    })
    totalW += w
  })

  if (totalW > 0) dims.forEach(d => state.userVector[d] /= totalW)

  // 2. 计算人格匹配
  let bestPersonality = null
  let bestScore = -1
  Object.entries(PERSONALITIES).forEach(([name, p]) => {
    const score = cosineSimilarity(state.userVector, p.coreVector)
    if (score > bestScore) {
      bestScore = score
      bestPersonality = name
    }
  })
  state.resultPersonality = bestPersonality

  // 3. 筛选价格范围产品
  const eligibleProducts = PRODUCTS.filter(p =>
    p.priceTier.includes(state.budgetTier) ||
    (state.budget >= p.priceRange[0] && state.budget <= p.priceRange[1] * 2)
  )

  // 4. 向量相似度 + 场景匹配排序
  const sceneAnswer = state.answers['scene']
  const scored = eligibleProducts.map(p => {
    let score = cosineSimilarity(state.userVector, p.vector)
    // 场景加权
    if (sceneAnswer && p.personality.includes(sceneAnswer)) score += 0.12
    return { ...p, score: Math.min(score, 0.99) }
  })

  scored.sort((a, b) => b.score - a.score)
  state.recommendedProducts = scored.slice(0, 3)
}

// 余弦相似度
function cosineSimilarity(a, b) {
  const dims = Object.keys(a)
  let dot = 0, magA = 0, magB = 0
  dims.forEach(d => {
    dot  += (a[d] || 0) * (b[d] || 0)
    magA += (a[d] || 0) ** 2
    magB += (b[d] || 0) ** 2
  })
  return dot / (Math.sqrt(magA) * Math.sqrt(magB) + 1e-8)
}

// ============================================================
//  渲染结果页
// ============================================================

function renderResult() {
  const p = PERSONALITIES[state.resultPersonality]
  const products = state.recommendedProducts

  // 头部
  document.getElementById('result-icon').textContent = p.icon
  document.getElementById('result-personality').textContent = state.resultPersonality
  document.getElementById('result-desc').textContent = p.desc

  // 雷达图
  drawRadar()

  // 产品列表
  const list = document.getElementById('product-list')
  list.innerHTML = products.map((prod, i) => {
    const matchPct = Math.round(prod.score * 85 + 10)
    const delay = i * 0.15
    return `
      <div class="product-card rank-${i+1}" style="animation-delay:${delay}s">
        <div class="product-icon">${prod.icon}</div>
        <div class="product-info">
          <div class="product-name">${i === 0 ? '🏆 ' : ''}${prod.name}</div>
          <div class="product-origin">${prod.origin}</div>
          <div class="product-aroma">${prod.aromaDesc}</div>
          <div class="product-tags" style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:6px">
            ${prod.tags.map(t => `<span style="font-size:11px;background:#f0faf4;border:1px solid #6DA87A44;padding:2px 8px;border-radius:50px;color:#3D6B4F">${t}</span>`).join('')}
          </div>
          <div class="product-match">
            <div class="match-bar">
              <div class="match-fill" style="width:${matchPct}%"></div>
            </div>
            <span class="match-score">${matchPct}% 匹配</span>
          </div>
          <div class="product-price">¥${prod.priceRange[0].toLocaleString()} ~ ¥${prod.priceRange[1].toLocaleString()}</div>
        </div>
      </div>`
  }).join('')

  // 场景标签
  const sceneAnswer = state.answers['scene']
  const sceneData = QUESTIONS.find(q => q.id === 'scene')?.options.find(o => o.id === sceneAnswer)
  const sceneTags = sceneData?.sceneTags || ['🌿 日常用香', '🕯️ 空间熏香', '🌙 睡前放松']
  document.getElementById('scene-tags').innerHTML = sceneTags.map(t =>
    `<div class="scene-tag">${t}</div>`
  ).join('')

  // 身份卡
  renderIdentityCard()
}

// ---------- 雷达图 ----------
function drawRadar() {
  const canvas = document.getElementById('radar-canvas')
  const ctx = canvas.getContext('2d')
  const W = canvas.width, H = canvas.height
  const cx = W / 2, cy = H / 2
  const R = Math.min(W, H) / 2 - 40
  const dims = Object.keys(AROMA_LABELS)
  const N = dims.length
  ctx.clearRect(0, 0, W, H)

  // 背景网格
  for (let level = 1; level <= 4; level++) {
    const r = R * level / 4
    ctx.beginPath()
    dims.forEach((_, i) => {
      const angle = (Math.PI * 2 * i / N) - Math.PI / 2
      const x = cx + r * Math.cos(angle)
      const y = cy + r * Math.sin(angle)
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    })
    ctx.closePath()
    ctx.strokeStyle = 'rgba(139,94,60,0.15)'
    ctx.lineWidth = 1
    ctx.stroke()
    if (level === 4) {
      ctx.fillStyle = 'rgba(250,243,232,0.3)'
      ctx.fill()
    }
  }

  // 轴线
  dims.forEach((_, i) => {
    const angle = (Math.PI * 2 * i / N) - Math.PI / 2
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(cx + R * Math.cos(angle), cy + R * Math.sin(angle))
    ctx.strokeStyle = 'rgba(139,94,60,0.2)'
    ctx.lineWidth = 1
    ctx.stroke()
  })

  // 数据多边形
  const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, R)
  gradient.addColorStop(0, 'rgba(201,150,58,0.5)')
  gradient.addColorStop(1, 'rgba(61,107,79,0.3)')

  ctx.beginPath()
  dims.forEach((d, i) => {
    const val = state.userVector[d] || 0
    const angle = (Math.PI * 2 * i / N) - Math.PI / 2
    const r = R * val
    const x = cx + r * Math.cos(angle)
    const y = cy + r * Math.sin(angle)
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  })
  ctx.closePath()
  ctx.fillStyle = gradient
  ctx.fill()
  ctx.strokeStyle = '#C9963A'
  ctx.lineWidth = 2
  ctx.stroke()

  // 数据点
  dims.forEach((d, i) => {
    const val = state.userVector[d] || 0
    const angle = (Math.PI * 2 * i / N) - Math.PI / 2
    const r = R * val
    const x = cx + r * Math.cos(angle)
    const y = cy + r * Math.sin(angle)
    ctx.beginPath()
    ctx.arc(x, y, 4, 0, Math.PI * 2)
    ctx.fillStyle = '#C9963A'
    ctx.fill()
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 1.5
    ctx.stroke()
  })

  // 标签
  dims.forEach((d, i) => {
    const angle = (Math.PI * 2 * i / N) - Math.PI / 2
    const labelR = R + 26
    const x = cx + labelR * Math.cos(angle)
    const y = cy + labelR * Math.sin(angle)
    const label = AROMA_LABELS[d]
    ctx.font = '11px -apple-system, PingFang SC, sans-serif'
    ctx.fillStyle = '#5C3D2E'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(label.emoji + label.name, x, y)
  })
}

// ---------- 身份卡 ----------
function renderIdentityCard() {
  const p = PERSONALITIES[state.resultPersonality]
  document.getElementById('card-icon').textContent = p.icon
  document.getElementById('card-personality-name').textContent = state.resultPersonality

  // 条形图
  const dims = ['sweet', 'woody', 'cool', 'milk', 'spicy', 'fruity']
  const bars = document.getElementById('card-bars')
  bars.innerHTML = dims.map(d => {
    const pct = Math.round((state.userVector[d] || 0) * 100)
    const label = AROMA_LABELS[d]
    return `
      <div class="card-bar-item">
        <span class="card-bar-label">${label.emoji}${label.name}</span>
        <div class="card-bar-track">
          <div class="card-bar-fill" style="width:${pct}%"></div>
        </div>
        <span class="card-bar-pct">${pct}%</span>
      </div>`
  }).join('')

  // 推荐摘要
  const top = state.recommendedProducts[0]
  const cardRecommend = document.getElementById('card-recommend')
  if (top) {
    cardRecommend.innerHTML = `
      <strong style="color:var(--gold-light)">专属推荐：</strong>${top.name}<br/>
      <span style="font-size:12px;opacity:0.8">${top.aromaDesc}</span>`
  }
}

// ============================================================
//  分享卡片生成
// ============================================================

function shareCard() {
  const modal = document.getElementById('share-modal')
  modal.classList.add('open')
  renderShareCanvas()
}

function renderShareCanvas() {
  const canvas = document.getElementById('share-canvas')
  const ctx = canvas.getContext('2d')
  const W = canvas.width, H = canvas.height

  // 背景渐变
  const bg = ctx.createLinearGradient(0, 0, W, H)
  bg.addColorStop(0, '#2C1A0E')
  bg.addColorStop(0.5, '#3D2010')
  bg.addColorStop(1, '#1A0A04')
  ctx.fillStyle = bg
  ctx.roundRect(0, 0, W, H, 20)
  ctx.fill()

  // 装饰光晕
  const glow = ctx.createRadialGradient(W * 0.7, H * 0.2, 0, W * 0.7, H * 0.2, 180)
  glow.addColorStop(0, 'rgba(201,150,58,0.18)')
  glow.addColorStop(1, 'transparent')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, W, H)

  // 顶部品牌
  ctx.font = 'bold 13px -apple-system'
  ctx.fillStyle = 'rgba(232,185,106,0.6)'
  ctx.textAlign = 'center'
  ctx.letterSpacing = '3px'
  ctx.fillText('沉香基因 · AI个性化推荐', W / 2, 36)

  // 图标
  const p = PERSONALITIES[state.resultPersonality]
  ctx.font = '60px serif'
  ctx.textAlign = 'center'
  ctx.fillText(p.icon, W / 2, 110)

  // 人格名称
  ctx.font = 'bold 28px -apple-system, PingFang SC'
  ctx.fillStyle = '#E8B96A'
  ctx.textAlign = 'center'
  ctx.fillText(state.resultPersonality, W / 2, 155)

  // 分割线
  ctx.strokeStyle = 'rgba(201,150,58,0.3)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(40, 172); ctx.lineTo(W - 40, 172)
  ctx.stroke()

  // 香气维度条形
  const dims = ['sweet', 'woody', 'cool', 'milk']
  const barX = 40, barW = W - 80
  dims.forEach((d, i) => {
    const y = 192 + i * 42
    const val = state.userVector[d] || 0
    const pct = val
    const label = AROMA_LABELS[d]

    // 标签
    ctx.font = '12px -apple-system, PingFang SC'
    ctx.fillStyle = 'rgba(250,243,232,0.7)'
    ctx.textAlign = 'left'
    ctx.fillText(label.emoji + ' ' + label.name, barX, y + 8)

    // 百分比
    ctx.textAlign = 'right'
    ctx.fillStyle = '#E8B96A'
    ctx.fillText(Math.round(pct * 100) + '%', barX + barW, y + 8)

    // 背景条
    ctx.fillStyle = 'rgba(255,255,255,0.08)'
    ctx.roundRect(barX, y + 14, barW, 6, 3)
    ctx.fill()

    // 填充条
    const fillGrad = ctx.createLinearGradient(barX, 0, barX + barW * pct, 0)
    fillGrad.addColorStop(0, '#C9963A')
    fillGrad.addColorStop(1, '#6DA87A')
    ctx.fillStyle = fillGrad
    ctx.roundRect(barX, y + 14, barW * pct, 6, 3)
    ctx.fill()
  })

  // 推荐产品
  const top = state.recommendedProducts[0]
  if (top) {
    ctx.fillStyle = 'rgba(201,150,58,0.12)'
    ctx.strokeStyle = 'rgba(201,150,58,0.3)'
    ctx.lineWidth = 1
    ctx.roundRect(30, 372, W - 60, 72, 10)
    ctx.fill()
    ctx.stroke()

    ctx.font = '11px -apple-system, PingFang SC'
    ctx.fillStyle = '#E8B96A'
    ctx.textAlign = 'left'
    ctx.fillText('✨ 专属推荐', 46, 394)

    ctx.font = 'bold 15px -apple-system, PingFang SC'
    ctx.fillStyle = '#FAF3E8'
    ctx.fillText(top.name, 46, 416)

    ctx.font = '12px -apple-system, PingFang SC'
    ctx.fillStyle = 'rgba(250,243,232,0.6)'
    ctx.fillText(top.aromaDesc, 46, 434)
  }

  // 底部装饰
  ctx.font = '13px -apple-system, PingFang SC'
  ctx.fillStyle = 'rgba(201,150,58,0.5)'
  ctx.textAlign = 'center'
  ctx.fillText('探索你的专属香气宇宙', W / 2, H - 24)

  // 大背景emoji
  ctx.save()
  ctx.globalAlpha = 0.05
  ctx.font = '160px serif'
  ctx.textAlign = 'center'
  ctx.fillText('🌿', W * 0.8, H * 0.6)
  ctx.restore()
}

function closeShare(e) {
  if (e.target === document.getElementById('share-modal')) closeShareModal()
}

function closeShareModal() {
  document.getElementById('share-modal').classList.remove('open')
}

// ---------- 重新测试 ----------
function restart() {
  showPage('page-welcome')
}

// ---------- canvas roundRect polyfill ----------
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
    if (w < 2 * r) r = w / 2
    if (h < 2 * r) r = h / 2
    this.beginPath()
    this.moveTo(x + r, y)
    this.arcTo(x + w, y, x + w, y + h, r)
    this.arcTo(x + w, y + h, x, y + h, r)
    this.arcTo(x, y + h, x, y, r)
    this.arcTo(x, y, x + w, y, r)
    this.closePath()
    return this
  }
}
