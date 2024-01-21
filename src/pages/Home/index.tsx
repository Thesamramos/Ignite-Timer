import { HandPalm, Play } from "phosphor-react";
import { useContext } from "react";
import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { cyclesContext } from "../../contexts/CyclesContext";

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

export function Home() {

    const {activeCycle, interruptCycle, createNewCycle} = useContext(cyclesContext)

    const newCycleForm = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0,
        },
    })

    const {handleSubmit, watch, reset} = newCycleForm

    function handleCreateNewCycle(data: NewCycleFormData) {
        createNewCycle(data)
        reset()
    }

    const task = watch('task')
    const isSubmitDisabled = !task
    return(
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)}>
                
                <FormProvider {...newCycleForm}>
                    <NewCycleForm />
                </FormProvider>
                <Countdown />

                { activeCycle ? (
                    <StopCountdownButton onClick={interruptCycle} type="button">
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