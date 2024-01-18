import { FormContainer, MinutesAmount, TaskInput } from "./styles";
import { useContext } from "react";
import { cyclesContext } from "../..";
import { useFormContext } from "react-hook-form";

export function NewCycleForm() {
    const { activeCycle } = useContext(cyclesContext)
    const { register } = useFormContext()
    return (
        <FormContainer>
                    <label htmlFor="task">Vou trabalhar em</label>
                    <TaskInput 
                        id="task" 
                        list="task-suggestions"
                        placeholder="Dê um nome para o seu projeto" 
                        disabled={!!activeCycle}
                        {...register('task')}
                    />

                    <datalist id="task-suggestions">
                        <option value="Projeto 1" />
                    </datalist>

                    <label htmlFor="minutesAmount">durante</label>
                    <MinutesAmount 
                        type="number" 
                        id="minutesAmount" 
                        placeholder="00"
                        step={1}
                        min={1}
                        max={60}
                        disabled={!!activeCycle}
                        {...register('minutesAmount', {valueAsNumber: true})}
                    />

                    <span>minutos.</span>
                </FormContainer>
    )
}