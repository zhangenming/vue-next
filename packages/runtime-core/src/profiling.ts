import { ComponentInternalInstance, formatComponentName } from './component'
import { devtoolsPerfEnd, devtoolsPerfStart } from './devtools'

let supported: boolean
let perf: any

if (typeof window !== 'undefined' && window.performance) {
  supported = true
  perf = window.performance
} else {
  supported = false
}

export function startMeasure(
  instance: ComponentInternalInstance,
  type: string
) {
  if (instance.appContext.config.performance && supported) {
    perf.mark(`vue-${type}-${instance.uid}`)
  }

  devtoolsPerfStart(instance, type, supported ? perf.now() : Date.now())
}

export function endMeasure(instance: ComponentInternalInstance, type: string) {
  if (instance.appContext.config.performance && supported) {
    const startTag = `vue-${type}-${instance.uid}`
    const endTag = startTag + `:end`
    perf.mark(endTag)
    perf.measure(
      `<${formatComponentName(instance, instance.type)}> ${type}`,
      startTag,
      endTag
    )
    perf.clearMarks(startTag)
    perf.clearMarks(endTag)
  }

  devtoolsPerfEnd(instance, type, supported ? perf.now() : Date.now())
}
