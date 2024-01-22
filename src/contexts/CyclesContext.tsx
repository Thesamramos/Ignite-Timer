import { ReactNode, createContext, useReducer, useState } from "react"

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

interface CycleState {
    cycles: Cycle[]
    activeCycleId: string | null
}

export function CyclesContextProvider({ children }: CyclesContextProviderProp) {
    const [cyclesState, dispatch] = useReducer((state: CycleState, action: any) => {
        switch (action.type) {
            case 'ADD_NEW_CYCLE':
                return {
                    ...state,
                    cycles: [...state.cycles, action.payload.newCycle],
                    activeCycleId: action.payload.newCycle.id
                }
            case 'INTERRUPT_CYCLE':
                return {
                    ...state,
                    cycles: state.cycles.map((cycle) => {
                        if(cycle.id == state.activeCycleId) {
                            return {...cycle, interruptedDate: new Date()}
                        }else {
                            return cycle
                        }
                    }),
                    activeCycleId: null,
                }
            case 'MARK_CURRENT_CYCLE_AS_FINISHED':
                return {
                    ...state,
                    cycles: state.cycles.map((cycle) => {
                        if(cycle.id == state.activeCycleId) {
                            return {...cycle, finishedDate: new Date()}
                        }else {
                            return cycle
                        }
                    }),
                    activeCycleId: null,
                }
            default: 
                return state
        }
    }, {
        cycles: [],
        activeCycleId: null
    })

    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0) 
    
    const {cycles, activeCycleId} = cyclesState    
    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

    function setSecondPassed(seconds: number) {
        setAmountSecondsPassed(seconds)
    }

    function markCurrentCycleHasFinished() {
        dispatch({
            type: 'MARK_CURRENT_CYCLE_AS_FINISHED',
            payload: {
                activeCycleId,
            },
        })
    }

    function createNewCycle(data: CreateCycleData) {
        const newCycle: Cycle = {
            id: String(new Date().getTime()),
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }

        dispatch({
            type: 'ADD_NEW_CYCLE',
            payload: {
                newCycle,
            },
        })
        setAmountSecondsPassed(0)
    }

    function interruptCycle() {
        dispatch({
            type: 'INTERRUPT_CYCLE',
            payload: {
                activeCycleId,
            },
        })
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