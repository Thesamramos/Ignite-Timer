import { ReactNode, createContext, useState } from "react"

interface CreateCycleData {
    task: string
    minutesAmount: number
}

interface Cycle {
    id: string
    task: string
    minutesAmount: number
    startDate: Date
    interruptedDate?: Date
    finishedDate?: Date
}

interface CycleContextType {
    cycles: Cycle[]
    activeCycle: Cycle | undefined
    activeCycleId: string | null
    amountSecondsPassed: number
    markCurrentCycleHasFinished: () => void
    setSecondPassed: (seconds: number) => void
    createNewCycle:(data: CreateCycleData) => void 
    interruptCycle: () => void
}

export const cyclesContext = createContext({} as CycleContextType)

interface CyclesContextProviderProp {
    children: ReactNode
}

export function CyclesContextProvider({ children }: CyclesContextProviderProp) {
    const [cycles, setCycles] = useState<Cycle[]>([])
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0) 
    
    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

    function setSecondPassed(seconds: number) {
        setAmountSecondsPassed(seconds)
    }

    function markCurrentCycleHasFinished() {
        setCycles((state) => state.map((cycle) => {
            if(cycle.id == activeCycleId) {
                return {...cycle, finishedDate: new Date()}
            } else {
                return cycle
            }
        })
        )
    }

    function createNewCycle(data: CreateCycleData) {
        const newCycle: Cycle = {
            id: String(new Date().getTime()),
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }

        setCycles((state) => [...state, newCycle])
        setActiveCycleId(newCycle.id)
        setAmountSecondsPassed(0)
    }

    function interruptCycle() {
        setCycles((state) =>
            state.map((cycle) => {
                if(cycle.id == activeCycleId) {
                    return {...cycle, interruptedDate: new Date() }
                } else {
                    return cycle
                }
            })
        )

        setActiveCycleId(null)
    }    

    return (
        <cyclesContext.Provider value={
            { 
                cycles,
                activeCycle, 
                activeCycleId, 
                markCurrentCycleHasFinished, 
                amountSecondsPassed,
                setSecondPassed,
                createNewCycle,
                interruptCycle,
            }
        }>
            {children}
        </cyclesContext.Provider>
    )
}