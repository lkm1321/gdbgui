/**
 * This is the entrypoint to the frontend applicaiton.
 *
 * store (global state) is managed in a single location, and each time the store
 * changes, components are notified and update accordingly.
 *
 */

 /* global Split */
 /* global debug */
 /* global initial_data */

import {store, initial_store_data} from './store.js';
import GdbApi from './GdbApi.jsx';
import ReactDOM from 'react-dom';
import React from 'react';
import TopBar from './TopBar.jsx';
import GlobalEvents from './GlobalEvents.js';
import MiddleLeft from './MiddleLeft.jsx';
import FileOps from './FileOps.jsx';
import Settings from './Settings.jsx';
import Modal from './GdbguiModal.jsx';
import HoverVar from './HoverVar.jsx';
import RightSidebar from './RightSidebar.jsx';
import GdbConsoleContainer from './GdbConsoleContainer.jsx';

store.options.debug = debug
store.initialize(initial_store_data)
// console.log(initial_data.pid)
// make this visible in the console
window.initial_data = initial_data 
window.store = store
// console.log(store.get('inferior_pid'))

class Gdbgui extends React.PureComponent {
    componentWillMount(){
        GdbApi.init()
        GlobalEvents.init()
        FileOps.init()  // this should be initialized before components that use store key 'source_code_state'
    }
    render(){
        return (

            <div className='splitjs_container'>

                <TopBar initial_user_input={initial_data.initial_binary_and_args} />

                <div id="middle">
                    <div id='middle_left' className='content'>
                        <MiddleLeft />
                    </div>

                    <div id='middle_right' className='content' style={{overflowX: 'visible'}}>
                        <RightSidebar signals={initial_data.signals} debug={debug} pid={initial_data.pid} />
                    </div>
                </div>


                <div id="bottom" className="split split-horizontal" style={{paddingBottom: '90px', width: '100%'}} >
                  <div id="bottom_content"
                        className="split content"
                        style={{paddingBottom: '30px' /* for height of input */}}>
                      <GdbConsoleContainer />
                  </div>
                </div>

                <Modal />
                <HoverVar />
                <Settings />
            </div>
        )
    }
    componentDidMount(){
        // Split the body into different panes using splitjs (https://github.com/nathancahill/Split.js)
        Split(['#middle_left', '#middle_right'], {
            gutterSize: 8,
            cursor: 'col-resize',
            direction: 'horizontal',  // horizontal makes a left/right pane, and a divider running vertically
            sizes: [70, 30],
        })

        Split(['#middle', '#bottom'], {
            gutterSize: 8,
            cursor: 'row-resize',
            direction: 'vertical',  // vertical makes a top and bottom pane, and a divider running horizontally
            sizes: [70, 30],
        })

        if (initial_data.pid){
            store.set('inferior_pid', parseInt(initial_data.pid))
            GdbApi.refresh()
            console.log("I was called :D")
        }
    }

}

ReactDOM.render(<Gdbgui />, document.getElementById('gdbgui'))