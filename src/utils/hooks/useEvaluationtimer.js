import useTimer from "./useTimer";

export default function useEvaluationTimer(startDate, endDate, currentDate) {
    // vérifier si la période de l'examen est arrivée
    const { hours, minutes, seconds, timerEnd: evaluationStart } = useTimer(currentDate, startDate)
    // vérifier si la période de l'examen est terminée
    const { hours: h, minutes: m, seconds: s, timerEnd: evaluationEnd } = useTimer(currentDate, endDate)

    return {
        startInfos: {hours, minutes, seconds, evaluationStart},
        endInfos: {hours: h, minutes: m, seconds: s, evaluationEnd}
    };
}