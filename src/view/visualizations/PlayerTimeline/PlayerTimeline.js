// global imports
import React from 'react';
import { useState, useEffect } from 'react';
// local imports
import LargeButton from "../../../components/buttons/LargeButton";
import { initial_timeline_filter_options } from '../../../config';
import { useD3 } from "../../../controller/hooks/useD3";
import { Visualizers } from '../../../model/enums/Visualizers';
import CodeForm from './CodeForm';
import EventFilterCtrl from './EventFilterCtrl';
import timeline from "./timeline";
import { PlayerTimelineModel } from '../../../model/visualizations/PlayerTimelineModel';

/**
 * @typedef {import("../../../model/visualizations/VisualizerModel").default} VisualizerModel
 * @typedef {import("../../../typedefs").StringSetter} StringSetter
 * @typedef {import("../../../typedefs").StringListSetter} StringListSetter
 * @typedef {import("../../../typedefs").SetterCallback} SetterCallback
 */

/**
 * force directed graph component for job/mission level data
 * @param {object} props raw data JSON object 
 * @param {VisualizerModel} props.model
 * @param {SetterCallback} props.setVisualizer
 * @returns 
 */
export default function PlayerTimeline({ model, setVisualizer }) {

    const [formVisible, setFormVisible] = useState(false)
    const [selectedEventForTagging, setSelectedEventForTagging] = useState(null)

    const [eventTypesDisplayed, setEventTypesDisplayed] = useState(null)
    const [data, setData] = useState()

    const [timelineZoom, setZoom] = useState(1)
    const [timelinePan, setPan] = useState(0)


    // register types of events found for this user
    useEffect(() => {
        const initialTypes = new Set()
        initial_timeline_filter_options[model.Game].forEach(type => {
            if (Object.hasOwn(model.meta.types, type)) initialTypes.add(type)
        });

        updateEventTypesDisplayed(initialTypes)
    }, [])

    // re-filter data when user changes the event types to be displayed
    const updateEventTypesDisplayed = (value) => {
        setEventTypesDisplayed(value);
        if (eventTypesDisplayed instanceof Set)
            setData(filter(model.ConvertedData, eventTypesDisplayed))
    }


    const eventOnClick = (event) => {
        // console.log(event)
        setSelectedEventForTagging(event)
        setFormVisible(true)
    }

    /**
     * draws the timeline
     */
    const diagram = useD3((svg) => {
        if (data)
        timeline(
            svg,
            data,
            eventOnClick,
            timelineZoom, timelinePan,
            setZoom, setPan)

    }, [data])


    if (model instanceof PlayerTimelineModel) {
        return (
            <>
                {/* chart */}
                <svg
                    ref={diagram}
                    className="w-full mx-0"
                />
                {/* chart info */}
                <div className="fixed bottom-5 left-8">
                    <LargeButton
                        selected={false}
                        onClick={() => { setVisualizer(Visualizers.JOB_GRAPH) }}
                        label='← BACK TO JOB GRAPH'
                    />
                    <p className='mb-3 text-4xl font-light'>Player {model.ConvertedData.meta.playerID}</p>
                    <p className="font-light">
                        From <span className="font-bold">{model.ConvertedData.meta.startTime}</span> to <span className="font-bold">{model.ConvertedData.meta.endTime}</span>
                    </p>
                    <p className="font-light">
                        Total time taken: <span className="font-bold">{model.ConvertedData.meta.totalTime}s</span>
                    </p>
                    <p className="font-light">
                        Session count: <span className="font-bold">{model.ConvertedData.meta.sessionCount}</span>
                    </p>
                </div>
                {/* chart settings */}
                <EventFilterCtrl
                    data={model.ConvertedData}
                    eventTypesDisplayed={eventTypesDisplayed}
                    setEventTypesDisplayed={updateEventTypesDisplayed}
                />
                {/* error code event tagging  */}
                {formVisible &&
                    <CodeForm
                    selectedGame={model.Game}
                    selectedPlayer={null}
                    setFormVisible={setFormVisible}
                    event={selectedEventForTagging}
                />
                }
            </>
        )
    }
    else {
        return <div>Wrong kind of VisualizerModel for PlayerTimeline</div>
    }
}

/**
 * filter events by event type
 * @param {*} data 
 * @param {*} filterParams list of event types to be included
 * @returns filtered data
 */
function filter(data, filterParams) {

    // select objects of specified event type
    const filteredEvents = data.events.filter(({ type }) => filterParams.has(type))

    // recalculate time elapsed in between filtered events
    for (let i = 0; i < filteredEvents.length - 1; i++) {
        const e = filteredEvents[i];

        const d = filteredEvents[i + 1].timestamp - e.timestamp
        e.duration = d
    }

    // (removed) recalculate min duration


    data.events = filteredEvents
    return data
}