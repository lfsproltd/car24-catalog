import React, {useEffect, useState, useRef} from "react";
import './style.css';
// import "../workshopQaDetail/workshopDetails.css";
import Question from '../../assets/img/question.svg';
import Popup from '../../common/popup/';
import QuestionMarkPopUp from '../../components/question-mark-pop-up';
import carImage from '../../assets/img/rectangle.svg';
import Slider from "react-slick";

const SummaryList = (props) => {
const [allocateOpen, setAllocateOpen] = useState(false);
const [totalCheckpointsCount, setTotalCheckpointsCount] = useState(props?.totalCheckpointsCount);
const [listDetails, setListDetails] = useState(props.appointmentDetail);
const [tagCounts, setTagCounts] = useState({});
const [magnifyImg, setMagnifier] = useState("");
const sliderRef = useRef();
const [modalImages, setModalImages] = useState([]);

useEffect(()=>{
    let tagCounts = {
        red:0,
        green:0,
        yellow:0,
        none:0
    }
    console.log(props.appointmentDetail);
    if(props && props.appointmentDetail){
        Object.keys(props.appointmentDetail.data.checkpoints).map((item)=>{
            if(props.appointmentDetail.data.qualityChecks[item] && 
            props.appointmentDetail.data.qualityChecks[item].invalidated === false){
                if(props.appointmentDetail.data.qualityChecks[item].tag === "NONE"){
                    tagCounts.none += 1
                }
                if(props.appointmentDetail.data.qualityChecks[item].tag === "GREEN"){
                    tagCounts.green += 1
                }
                if(props.appointmentDetail.data.qualityChecks[item].tag === "YELLOW"){
                    tagCounts.yellow += 1
                }
                if(props.appointmentDetail.data.qualityChecks[item].tag === "RED"){
                    tagCounts.red += 1
                }
            }

            if((!props.appointmentDetail.data.qualityChecks[item] && props.appointmentDetail.data.checkpoints[item]) ||
            props.appointmentDetail.data.qualityChecks[item].invalidated === true){
                tagCounts.green += 1
            }
        })
        setTagCounts(tagCounts);
        console.log(tagCounts);


    }
    setListDetails(props.appointmentDetail);
},[props.appointmentDetail]);
  const onAllocateOpen = () => {
    setAllocateOpen(true);
  };
  const onAllocateClose = () => {
      setAllocateOpen(false);
  };
  const [showConfirmation, setShowConfirmation] = useState("NONE");
  const addTagHandler = (tagName) => {
     let finalTag = `${tagName.toUpperCase() + "_TAG"}`;
     setShowConfirmation(finalTag);
  }

  const imageMagnifier = (data, allImages, index) => {
    setMagnifier(data);
    setModalImages(allImages);
    setTimeout(() => {
    //   sliderRef.current.slickGoTo(index);
    }, 100);
  };

  const renderImages = (itemTop, item) => {
    let imageAr = [];
    imageAr = itemTop[item].images.map((image, index) => (
      <div
        key={index} className="imageWrap">
        <img src={image.path} width="227" alt={image.label} key={index} onClick={() => { imageMagnifier(image, itemTop[item].images, index) }} å />
      </div>
    ));
    return imageAr;
  };

  const sliderSettings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: false,
    arrow: true
  };

    return (
        <div className="summaryList">
            <div className="titleWrapperMain">
            <Popup isOpen={showConfirmation !== "NONE"} 
            close={e=>onAllocateClose(setShowConfirmation("NONE"))}>
            <QuestionMarkPopUp actionButton={setShowConfirmation} 
            onClose={e=>onAllocateClose(setShowConfirmation("NONE"))} 
            type="carTagging" 
            message={"Are you sure ?"}
            currentTagSelected={showConfirmation}
            addTagging={props.addTagging}
            listDetails={listDetails} />
            </Popup>
                <h2>Summary list</h2>
                <span className="count">{totalCheckpointsCount ? totalCheckpointsCount : 0}</span>
            </div>
            <div className="tagSection">
                <div className="tagsction">
                    <p>Choose a tag</p>
                    <div className="settagWrapper">
                        <div className="dropdown">
                            <span>{showConfirmation? showConfirmation : "NONE"} </span>
                            <ul>
                                <li className="none" onClick={e=>addTagHandler("none")}>None</li>
                                <li className="green" onClick={e=>addTagHandler("green")}>Green</li>
                                <li className="yellow" onClick={e=>addTagHandler("yellow")}>Yellow </li>
                                <li className="red" onClick={e=>addTagHandler("red")}>Red</li>
                            </ul>
                        </div>
                        {/* <img src={Question} alt="info"  onClick={onAllocateOpen} /> */}
                        <span className="infoText">Choose a tag as per car condition. It’s mandatory!</span>
                        <Popup isOpen={allocateOpen} close={onAllocateClose}>
                            <QuestionMarkPopUp onClose={onAllocateClose} />
                        </Popup>
                    </div>
                </div>
                <div className="countcard">
                    <div className="countCardGreen">
                        <p>{tagCounts.green}</p>
                        <span>Green</span>
                    </div>
                    <div className="countCardYellow">
                        <p>{tagCounts.yellow}</p>
                        <span>Yellow</span>
                    </div>
                    <div className="countCardRed">
                        <p>{tagCounts.red}</p>
                        <span>Red</span>
                    </div>
                </div>
            </div>
            <div className="cardmainWrapper">
                {listDetails &&  listDetails.data && Object.keys(listDetails.data.checkpoints).map((item,index)=>{
                    return(
                        <>
                         {listDetails.data.checkpoints[item]?.choices.length ? ( 
                        <div className="cardRow">
                            <div className="tabsSliderWrapper">
                            <Slider {...sliderSettings}>
                                {renderImages(listDetails.data.checkpoints, item)}
                            </Slider>
                            </div>
                        <div className="cardRowDetails">
                        <div className="detailsHeading">
                            <h3>{item}</h3>
                            <p className={listDetails.data.qualityChecks[item]?.tag === "NONE" ? "greyLabel" :
                            listDetails.data.qualityChecks[item]?.tag === "GREEN" ? "greenLabel" :
                            listDetails.data.qualityChecks[item]?.tag === "YELLOW" ? "yellowLabel" :
                            listDetails.data.qualityChecks[item]?.tag === "RED" ? "redLabel" : ''}>
                            {listDetails.data?.qualityChecks[item]?.tag ? listDetails.data?.qualityChecks[item]?.tag : 'GREEN'}</p>
                        </div>
                        {listDetails.data.checkpoints[item] && listDetails.data.checkpoints[item].choices &&
                        listDetails.data.checkpoints[item].choices.length === 0 ? (
                            <div className="imperfectionWrapper">
                                <div className="imperfection p-5">
                                    {listDetails.data.checkpoints[item].noImperfectionChoices[0]}
                                </div>
                            </div>                            
                        ):(
                        <div className="imperfectionWrapper">
                            <div className="imperfection">
                                <h4>Acceptable imperfection <br/> (not shown to customer)</h4>
                                <ul>
                                {listDetails.data.checkpoints[item].choices.map((choice)=>{
                                        return(<>
                                            {choice && choice.acceptable && (
                                                <li>{choice.choice }</li>
                                            )}
                                            </>
                                        )
                                        })}
                                </ul>
                            </div>
                            <div className="imperfection">
                                <h4>Non-Acceptable imperfection <br/> (shown to customer)</h4>
                                <ul>
                                {listDetails.data.checkpoints[item].choices.map((choice)=>{
                                        return(<>
                                            {choice && !choice.acceptable && (
                                                <li>{choice.choice }</li>
                                            )}
                                            </>
                                        )
                                        })}
                                </ul>
                            </div>
                        </div>
                             )}
                    </div>
                        </div>
                         ):(null)}
                        </>
                    )
                })}

                    {listDetails &&  listDetails.data && Object.keys(listDetails.data.checkpoints).map((item,index)=>{
                    return(
                        <>
                         {!listDetails.data.checkpoints[item]?.choices.length && listDetails.data?.qualityChecks[item]?.tag !== "GREEN" ? ( 
                        <div className="cardRow">
                            <div className="tabsSliderWrapper">
                            <Slider {...sliderSettings}>
                                {renderImages(listDetails.data.checkpoints, item)}
                            </Slider>
                            </div>
                        <div className="cardRowDetails">
                        <div className="detailsHeading">
                            <h3>{item}</h3>
                            <p className={listDetails.data.qualityChecks[item]?.tag === "NONE" ? "greyLabel" :
                            listDetails.data.qualityChecks[item]?.tag === "GREEN" ? "greenLabel" :
                            listDetails.data.qualityChecks[item]?.tag === "YELLOW" ? "yellowLabel" :
                            listDetails.data.qualityChecks[item]?.tag === "RED" ? "redLabel" : ''}>
                            {listDetails.data?.qualityChecks[item]?.tag ? listDetails.data?.qualityChecks[item]?.tag : 'GREEN'}</p>
                        </div>
                        {listDetails.data.checkpoints[item] && listDetails.data.checkpoints[item].choices &&
                        listDetails.data.checkpoints[item].choices.length === 0 ? (
                            <div className="imperfectionWrapper">
                                <div className="imperfection p-5">
                                    {listDetails.data.checkpoints[item].noImperfectionChoices[0]}
                                </div>
                            </div>                            
                        ):(
                        <div className="imperfectionWrapper">
                            <div className="imperfection">
                                <h4>Acceptable imperfection <br/> (not shown to customer)</h4>
                                <ul>
                                {listDetails.data.checkpoints[item].choices.map((choice)=>{
                                        return(<>
                                            {choice && choice.acceptable && (
                                                <li>{choice.choice }</li>
                                            )}
                                            </>
                                        )
                                        })}
                                </ul>
                            </div>
                            <div className="imperfection">
                                <h4>Non-Acceptable imperfection <br/>(shown to customer)</h4>
                                <ul>
                                {listDetails.data.checkpoints[item].choices.map((choice)=>{
                                        return(<>
                                            {choice && !choice.acceptable && (
                                                <li>{choice.choice }</li>
                                            )}
                                            </>
                                        )
                                        })}
                                </ul>
                            </div>
                        </div>
                             )}
                    </div>
                        </div>
                         ):(null)}
                        </>
                    )
                })}

            </div>
        </div>

    );
};
export default SummaryList;