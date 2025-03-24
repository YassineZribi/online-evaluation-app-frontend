import React from 'react'
import useEvaluationTimer from '../utils/hooks/useEvaluationtimer'

function Timer({evaluation}) {
    const { startInfos, endInfos } = useEvaluationTimer(evaluation.startDate, evaluation.endDate, new Date())
    console.log(startInfos)
    console.log('end', endInfos)
    return (
        <div className={`fixed top-15 right-5 text-center ${endInfos.minutes == '00' ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
            Temps restant
            <table className='mx-auto'>
                <tbody>
                    <tr>
                        <td>{endInfos.hours}</td><td>:</td><td>{endInfos.minutes}</td><td>:</td><td>{endInfos.seconds}</td>
                    </tr>
                    <tr className='relative bottom-1 text-xs'>
                        <td>H</td><td></td><td>M</td><td></td><td>S</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default Timer