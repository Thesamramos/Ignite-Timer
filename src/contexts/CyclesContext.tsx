import { ReactNode, createContext, useReducer, useState, useEffect } from "react"
import { Cycle, cycleReducer } from "../reducer/cycles/reducer"
import { addNewCycleAction, interruptCycleAction, markCurrentCycleAsFinishedAction } from "../reducer/cycles/action"
import { differenceInSeconds } from "date-fns"

interface CreateCycleData {
    task: string
    minutesAmount: number
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
    const [cyclesState, dispatch] = useReducer(cycleReducer, 
    {
        cycles: [],
        activeCycleId: null
    }, 
    (initialState) => {
        const storedStateAsJSON = localStorage.getItem(
            '@ignite-time:cycles-state-1.0.0'
        ) 

        if(storedStateAsJSON) {
            return JSON.parse(storedStateAsJSON)
        }

        return initialState
    }
)

    useEffect(() =>{
        const stateJSON = JSON.stringify(cyclesState)

        localStorage.setItem('@ignite-time:cycles-state-1.0.0', stateJSON)
    }, [cyclesState])

    const {cycles, activeCycleId} = cyclesState    
    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

    const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
        if(activeCycle) {
            return differenceInSeconds(
                new Date(), 
                new Date(activeCycle.startDate)
            )
        }

        return 0
    }) 

    function setSecondPassed(seconds: number) {
        setAmountSecondsPassed(seconds)
    }

    function markCurrentCycleHasFinished() {
        dispatch(markCurrentCycleAsFinishedAction())
    }

    function createNewCycle(data: CreateCycleData) {
        const newCycle: Cycle = {
            id: String(new Date().getTime()),
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }

        dispatch(addNewCycleAction(newCycle))
        setAmountSecondsPassed(0)
    }

    function interruptCycle() {
        dispatch(interruptCycleAction())
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