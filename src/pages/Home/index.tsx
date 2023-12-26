import { Play } from "phosphor-react";
import { HomeContainer, FormContainer, CountdownContainer, Separator, StartCountdownButton, MinutesAmount, TaskInput } from "./styles";

export function Home() {
    return(
        <HomeContainer>
            <form>
                <FormContainer>
                    <label htmlFor="task">Vou trabalhar em</label>
                    <TaskInput id="task" placeholder="Dê um nome para o seu projeto" />

                    <label htmlFor="minutesAmount">durante</label>
                    <MinutesAmount 
                        type="number" 
                        id="minutesAmount" 
                        placeholder="00"
                    />

                    <span>minutos.</span>
                </FormContainer>

                <CountdownContainer>
                    <span>0</span>
                    <span>0</span>
                    <Separator>:</Separator>
                    <span>0</span>
                    <span>0</span>
                </CountdownContainer>

                <StartCountdownButton disabled type="submit">
                    <Play size={24} />
                    Começar
                </StartCountdownButton>
            </form>
        </HomeContainer>
    )
}