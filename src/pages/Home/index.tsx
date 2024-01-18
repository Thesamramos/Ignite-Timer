import { HandPalm, Play } from "phosphor-react";
import { createContext, useState } from "react";
import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import * as zod from "zod";

import { 
        HomeContainer, 
        StartCountdownButton, 
        StopCountdownButton,
    } from "./styles";


type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>
    
const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    minutesAmount: zod.number().min(1).max(60),
})

interface Cycle {
    id: string
    task: string
    minutesAmount: number
    startDate: Date
    interruptedDate?: Date
    finishedDate?: Date
}

interface CycleContextType {
    activeCycle: Cycle | undefined
    activeCycleId: string | null
    amountSecondsPassed: number
    markCurrentCycleHasFinished: () => void
    setSecondPassed: (seconds: number) => void
}

export const cyclesContext = createContext({} as CycleContextType)

export function Home() {
    const [cycles, setCycles] = useState<Cycle[]>([])
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0) 

    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

    const newCycleForm = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0,
        },
    })

    const {handleSubmit, watch, reset} = newCycleForm

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

    function handleCreateNewCycle(data: NewCycleFormData) {
        const newCycle: Cycle = {
            id: String(new Date().getTime()),
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }

        setCycles((state) => [...state, newCycle])
        setActiveCycleId(newCycle.id)
        setAmountSecondsPassed(0)
        reset();
    }

    function handleInterruptCycle() {
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

    const task = watch('task')
    const isSubmitDisabled = !task
    return(
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)}>
                <cyclesContext.Provider value={
                    {   activeCycle, 
                        activeCycleId, 
                        markCurrentCycleHasFinished, 
                        amountSecondsPassed,
                        setSecondPassed,
                    }
                }>
                    <FormProvider {...newCycleForm}>
                        <NewCycleForm />
                    </FormProvider>
                    <Countdown />
                </cyclesContext.Provider>

                { activeCycle ? (
                    <StopCountdownButton onClick={handleInterruptCycle} type="button">
                        <HandPalm size={24} />
                        Interromper
                    </StopCountdownButton>
                ) : (
                    <StartCountdownButton disabled={isSubmitDisabled} type="submit">
                        <Play size={24} />
                        Começar
                    </StartCountdownButton>
                )}
            </form>
        </HomeContainer>
    )
}