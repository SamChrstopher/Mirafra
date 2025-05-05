import { useDispatch, useSelector } from "react-redux";
import {increment, decrement} from './store/CounterSlice'

function Counter(){
    const count = useSelector((state)=>state.counter.value)
    const dispatch = useDispatch()

    return(
        <div>
            <h1>Redux Counter</h1>
            <span>{count}</span>
            <button onClick={()=>dispatch(increment())}>+</button>
            <button onClick={()=>dispatch(decrement())}>-</button>
        </div>
    )

}
export default Counter;