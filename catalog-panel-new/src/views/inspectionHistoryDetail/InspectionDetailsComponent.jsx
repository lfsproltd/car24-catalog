import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

// OLD render imports
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Slider from "react-slick";
import { dateFormat, timeFormat } from "../../utils/utils";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import loaderImg from "../../assets/img/loader.png";

import "./inspectionDetailsStyles.css";
import "../workshopQaDetails/workshopQaDetails.css";

const SIDEBAR_HEADS = {
  UNACCEPTABLE: "Unacceptable Imperfection",
  ACCEPTABLE: "Acceptable Imperfection",
  NO_IMPERFECTION: "No Imperfection",
};

const INITIAL_DATA = {
  [SIDEBAR_HEADS.UNACCEPTABLE]: {
    subCategory: [],
    expand: true,
  },
  [SIDEBAR_HEADS.ACCEPTABLE]: {
    subCategory: [],
    expand: true,
  },
  [SIDEBAR_HEADS.NO_IMPERFECTION]: {
    subCategory: [],
    expand: true,
  },
};

const InspectionDetailsComponent = (props) => {
  const { inspectionDetailsProps = {}, langTransObj } = props;

  const { labels = {} } = langTransObj || {};

  const [appointmentDetails, setAppointmentDetails] = useState({});
  const [imperfectionCount, setImperfectionCount] = useState("");
  const [nonAccImperfection, setNonAccImperfection] = useState("");
  const [accImperfection, setAccImperfection] = useState("");
  const [toggleViewHandlerFlag, setToggleViewHandler] = useState("");
  const [allImages, setAllImages] = useState([]);
  const [lastInspectionData, setInspectionData] = useState([]);
  const [magnifyImg, setMagnifier] = useState("");
  const sliderRef = useRef();
  const [modalImages, setModalImages] = useState([]);
  const [inspectionSummary, setInspectionSummary] = useState({});
  const [activeTab, setActiveTab] = useState("Exterior");
  const [filterednspectionData, setFilterednspectionData] = useState([]);
  const currentCardRef = useRef();
  const [activeSideBar, setActiveSideBar] = useState(null);

  const sliderSettings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: false,
    arrow: true,
  };

  const sliderTabSettings = {
    slidesToShow: 4,
    slidesToScroll: 2,
    infinite: false,
    arrow: true,
  };

  //#region Glueish code

  const [sideTabs, setSideTab] = useState(INITIAL_DATA);

  useEffect(() => {
    if (inspectionDetailsProps && inspectionDetailsProps.catalogSummary) {
      setInspectionSummary(inspectionDetailsProps.catalogSummary);
    }
  }, [inspectionDetailsProps.catalogSummary]);

  useEffect(() => {
    let totlaNonAcceptableImperfections = 0;
    let totlalAcceptableImperfections = 0;
    let allImages = [];
    let allVideos = [];
    if (
      inspectionDetailsProps &&
      inspectionDetailsProps.inspectionDetails[0] &&
      inspectionDetailsProps.inspectionDetails[0].data &&
      inspectionDetailsProps.inspectionDetails[0].data.checkpoints
    ) {
      Object.keys(
        inspectionDetailsProps.inspectionDetails[0].data.checkpoints
      ).map((item) => {
        inspectionDetailsProps.qaTopImagesKeys?.map((itemTop) => {
          if (itemTop === item) {
            inspectionDetailsProps.inspectionDetails[0].data.checkpoints[
              itemTop
            ].images.map((item, index) => {
              allImages.push(item);
            });
            inspectionDetailsProps.inspectionDetails[0].data.checkpoints[
              itemTop
            ].videos.map((item, index) => {
              allVideos.push(item);
            });
          }
        });
        setAllImages(allImages);
      });

      Object.keys(
        inspectionDetailsProps.inspectionDetails[0].data.qualityChecks
      ).map((item) => {
        if (
          inspectionDetailsProps.inspectionDetails[0].data.qualityChecks[item]
            .invalidated === false
        ) {
          if (
            inspectionDetailsProps.inspectionDetails[0].data.checkpoints[item]
              .ok === false
          ) {
            totlaNonAcceptableImperfections += 1;
          } else if (
            inspectionDetailsProps.inspectionDetails[0].data.checkpoints[item]
              .choices.length > 0
          ) {
            totlalAcceptableImperfections += 1;
          }
        }
      });
    }
    setNonAccImperfection(totlaNonAcceptableImperfections);
    setAccImperfection(totlalAcceptableImperfections);
    let totalQCheck = 0;
    if (
      inspectionDetailsProps &&
      inspectionDetailsProps.inspectionDetails[0] &&
      inspectionDetailsProps.inspectionDetails[0].data &&
      inspectionDetailsProps.inspectionDetails[0].data.qualityChecks
    ) {
      Object.keys(
        inspectionDetailsProps.inspectionDetails[0].data.qualityChecks
      ).map((item) => {
        Object.keys(
          inspectionDetailsProps.inspectionDetails[0].data.qualityChecks[item]
        ).map((invalidated) => {
          if (
            invalidated &&
            invalidated === "invalidated" &&
            inspectionDetailsProps.inspectionDetails[0].data.qualityChecks[
              item
            ][invalidated] === false
          ) {
            totalQCheck += 1;
          }
        });
      });
      setImperfectionCount(totalQCheck);
    }
  }, [inspectionDetailsProps.inspectionDetails]);

  useEffect(() => {
    inspectionDetailsProps &&
      inspectionDetailsProps.inspectionDetails.map((item) => {
        if (item && item.updatedAt) {
          item.formatedUpdatedAt = dateFormat(item.updatedAt);
        }
      });
    setAppointmentDetails(inspectionDetailsProps.inspectionDetails[0]);
  }, [inspectionDetailsProps.inspectionDetails]);

  useEffect(() => {
    if (
      inspectionDetailsProps &&
      inspectionDetailsProps.catalogMaster &&
      inspectionDetailsProps.catalogMaster.checkpoints &&
      inspectionDetailsProps.inspectionDetails[0] &&
      inspectionDetailsProps.inspectionDetails[0].data &&
      inspectionDetailsProps.inspectionDetails[0].data.checkpoints
    ) {
      let orderedCheckpoints = {};
      inspectionDetailsProps.catalogMaster.checkpoints.map((item) => {
        if (
          inspectionDetailsProps.inspectionDetails[0].data.checkpoints[item.key]
        ) {
          orderedCheckpoints[item.key] =
            inspectionDetailsProps.inspectionDetails[0].data.checkpoints[
              item.key
            ];
        }
      });
      inspectionDetailsProps.inspectionDetails[0].data.checkpoints =
        orderedCheckpoints;
    }

    if (
      inspectionDetailsProps &&
      inspectionDetailsProps.catalogMaster &&
      inspectionDetailsProps.catalogMaster.checkpoints &&
      inspectionDetailsProps.inspectionDetails[0] &&
      inspectionDetailsProps.inspectionDetails[0].data &&
      inspectionDetailsProps.inspectionDetails[0].data.qualityChecks
    ) {
      let orderedQualitychecks = {};
      inspectionDetailsProps.catalogMaster.checkpoints.map((item) => {
        if (
          inspectionDetailsProps.inspectionDetails[0].data.qualityChecks[
            item.key
          ] &&
          !inspectionDetailsProps.inspectionDetails[0].data.qualityChecks[
            item.key
          ].invalidated
        ) {
          orderedQualitychecks[item.key] =
            inspectionDetailsProps.inspectionDetails[0].data.qualityChecks[
              item.key
            ];
        }
      });
      inspectionDetailsProps.inspectionDetails[0].data.qualityChecks =
        orderedQualitychecks;
      console.log(orderedQualitychecks);
    }

    inspectionDetailsProps &&
      inspectionDetailsProps.inspectionDetails.map((item, index) => {
        if (item && item.updatedAt) {
          item.formatedUpdatedAt = dateFormat(item.updatedAt);
          item.formatedUpdateAtTime = timeFormat(item.updatedAt);
        }
      });
    setInspectionData(inspectionDetailsProps.inspectionDetails);
    if (
      inspectionDetailsProps &&
      inspectionDetailsProps.catalogMaster &&
      inspectionDetailsProps.catalogMaster.categories
    )
      setData(
        inspectionDetailsProps.catalogMaster.categories[0].category,
        inspectionDetailsProps.inspectionDetails
      );
  }, [
    inspectionDetailsProps.inspectionDetails,
    inspectionDetailsProps.catalogMaster,
  ]);

  // Creating Side Filter data
  useEffect(() => {
    let sideBarClone = JSON.parse(JSON.stringify(sideTabs));
    Object.keys(sideBarClone).forEach(
      (item) => (sideBarClone[item].subCategory = [])
    );

    if (
      inspectionDetailsProps &&
      inspectionDetailsProps.catalogMaster &&
      inspectionDetailsProps.inspectionDetails.length > 0
    ) {
      inspectionDetailsProps.catalogMaster.categories &&
        inspectionDetailsProps.catalogMaster.categories.length > 0 &&
        inspectionDetailsProps.catalogMaster.categories.forEach((item) => {
          if (item.category === activeTab) {
            item.subCategories.forEach((subItem) => {
              subItem.checkpoints.forEach((subItemCheckpoint) => {
                if (
                  inspectionDetailsProps.inspectionDetails.length > 0 &&
                  inspectionDetailsProps.inspectionDetails[0].data.qualitychecks
                ) {
                  //qualitychecks
                  if (
                    Object.keys(
                      inspectionDetailsProps.inspectionDetails[0].data
                        .qualitychecks
                    ).length > 0 &&
                    inspectionDetailsProps.inspectionDetails[0].data
                      .checkpoints[subItemCheckpoint.key] ===
                      inspectionDetailsProps.inspectionDetails[0].data
                        .qualityChecks[subItemCheckpoint.key] &&
                    inspectionDetailsProps.inspectionDetails[0].data
                      .checkpoints[subItemCheckpoint.key]?.choices.length > 0 &&
                    inspectionDetailsProps.inspectionDetails[0].data
                      .checkpoints[subItemCheckpoint.key]?.ok === true
                  ) {
                    sideBarClone[SIDEBAR_HEADS.ACCEPTABLE].subCategory.push({
                      header: subItemCheckpoint.key,
                      ...inspectionDetailsProps.inspectionDetails[0].data
                        .checkpoints[subItemCheckpoint.key],
                    });
                  } else if (
                    Object.keys(
                      inspectionDetailsProps.inspectionDetails[0].data
                        .qualitychecks
                    ).length > 0 &&
                    inspectionDetailsProps.inspectionDetails[0].data
                      .checkpoints[subItemCheckpoint.key] ===
                      inspectionDetailsProps.inspectionDetails[0].data
                        .qualityChecks[subItemCheckpoint.key] &&
                    inspectionDetailsProps.inspectionDetails[0].data
                      .checkpoints[subItemCheckpoint.key]?.ok === false &&
                    inspectionDetailsProps.inspectionDetails[0].data
                      .checkpoints[subItemCheckpoint.key]?.choices.length
                  ) {
                    sideBarClone[SIDEBAR_HEADS.UNACCEPTABLE].subCategory.push({
                      header: subItemCheckpoint.key,
                      ...inspectionDetailsProps.inspectionDetails[0].data
                        .checkpoints[subItemCheckpoint.key],
                    });
                  }
                }
                // non-quality

                if (
                  inspectionDetailsProps.inspectionDetails.length > 0 &&
                  inspectionDetailsProps.inspectionDetails[0].data.checkpoints
                ) {
                  if (
                    Object.keys(
                      inspectionDetailsProps.inspectionDetails[0].data
                        .checkpoints
                    ).length > 0 &&
                    inspectionDetailsProps.inspectionDetails[0].data
                      .checkpoints[subItemCheckpoint.key] !==
                      inspectionDetailsProps.inspectionDetails[0].data
                        .qualityChecks[subItemCheckpoint.key] &&
                    inspectionDetailsProps.inspectionDetails[0].data
                      .checkpoints[subItemCheckpoint.key]?.choices.length > 0 &&
                    inspectionDetailsProps.inspectionDetails[0].data
                      .checkpoints[subItemCheckpoint.key]?.ok === true
                  ) {
                    sideBarClone[SIDEBAR_HEADS.ACCEPTABLE].subCategory.push({
                      header: subItemCheckpoint.key,
                      ...inspectionDetailsProps.inspectionDetails[0].data
                        .checkpoints[subItemCheckpoint.key],
                    });
                  } else if (
                    Object.keys(
                      inspectionDetailsProps.inspectionDetails[0].data
                        .checkpoints
                    ).length > 0 &&
                    inspectionDetailsProps.inspectionDetails[0].data
                      .checkpoints[subItemCheckpoint.key] !==
                      inspectionDetailsProps.inspectionDetails[0].data
                        .qualityChecks[subItemCheckpoint.key] &&
                    inspectionDetailsProps.inspectionDetails[0].data
                      .checkpoints[subItemCheckpoint.key]?.ok === false &&
                    inspectionDetailsProps.inspectionDetails[0].data
                      .checkpoints[subItemCheckpoint.key]?.choices.length > 0
                  ) {
                    sideBarClone[SIDEBAR_HEADS.UNACCEPTABLE].subCategory.push({
                      header: subItemCheckpoint.key,
                      ...inspectionDetailsProps.inspectionDetails[0].data
                        .checkpoints[subItemCheckpoint.key],
                    });
                  } else if (
                    inspectionDetailsProps.inspectionDetails[0].data
                      .checkpoints[subItemCheckpoint.key]?.ok === true &&
                    inspectionDetailsProps.inspectionDetails[0].data
                      .checkpoints[subItemCheckpoint.key]?.noImperfectionChoices
                      .length > 0
                  ) {
                    sideBarClone[
                      SIDEBAR_HEADS.NO_IMPERFECTION
                    ].subCategory.push({
                      header: subItemCheckpoint.key,
                      ...inspectionDetailsProps.inspectionDetails[0].data
                        .checkpoints[subItemCheckpoint.key],
                    });
                  }
                }
              });
            });
          }
        });
      setSideTab(sideBarClone);
    }
  }, [filterednspectionData]);

  useEffect(() => {
    window.setTimeout(() => {
      if (currentCardRef && currentCardRef.current) {
        currentCardRef.current.scrollIntoView({
          behavior: "auto",
          block: "center",
        });
      }
    }, 0);
  }, [activeSideBar]);

  const moveTo = (tab) => {
    setActiveSideBar(tab);
  };

  const toggleVideoHandler = (index) => {
    setToggleViewHandler(index);
  };

  const toggleImageHandler = (index) => {
    setToggleViewHandler("");
  };

  const imageMagnifier = (data, allImages, index) => {
    setMagnifier(data);
    setModalImages(allImages);
    setTimeout(() => {
      sliderRef.current.slickGoTo(index);
    }, 100);
  };

  const renderImages = (itemTop, item) => {
    let imageAr = [];
    imageAr =
      itemTop.data.checkpoints[item] &&
      itemTop.data.checkpoints[item].images.map((image, index) => (
        <div key={index} className="imageWrap">
          <img
            src={image.path}
            alt={image.label}
            key={index}
            onClick={() => {
              imageMagnifier(
                image,
                itemTop.data.checkpoints[item].images,
                index
              );
            }}
            å
          />
        </div>
      ));
    return imageAr;
  };

  const setData = (tab, data) => {
    setActiveTab(tab);
    let curentData = JSON.parse(JSON.stringify(data));
    let filteredCheckpoints = {};
    let filteredQualityCheck = {};
    curentData.forEach((itemTop) => {
      itemTop.data.checkpoints &&
        Object.keys(itemTop.data.checkpoints).map((item) => {
          return (filteredCheckpoints = {
            ...filteredCheckpoints,
            ...(item.includes(tab) && {
              [item]: itemTop.data.checkpoints[item],
            }),
          });
        });

      itemTop.data.checkpoints = filteredCheckpoints;

      itemTop.data.qualityChecks &&
        Object.keys(itemTop.data.qualityChecks).map(
          (item) =>
            (filteredQualityCheck = {
              ...filteredQualityCheck,
              ...(item.includes(tab) && {
                [item]: itemTop.data.qualityChecks[item],
              }),
            })
        );
      let unAcc = {};
      let acc = {};
      let noiImp = {};

      Object.keys(filteredQualityCheck).map((qc) => {
        if (
          filteredCheckpoints[qc].ok === false &&
          filteredCheckpoints[qc].noImperfectionChoices.length === 0
        ) {
          unAcc = {
            ...unAcc,
            [qc]: filteredQualityCheck[qc],
          };
        } else if (
          filteredCheckpoints[qc].ok === true &&
          filteredCheckpoints[qc].noImperfectionChoices.length === 0
        ) {
          acc = {
            ...acc,
            [qc]: filteredQualityCheck[qc],
          };
        } else if (
          filteredCheckpoints[qc].ok === true &&
          filteredCheckpoints[qc].noImperfectionChoices.length > 0
        ) {
          noiImp = {
            ...noiImp,
            [qc]: filteredQualityCheck[qc],
          };
        }
      });

      // itemTop.data.qualityChecks = sortfilteredQualityCheck
      itemTop.data.qualityChecks = { ...unAcc, ...acc, ...noiImp };
    });
    setFilterednspectionData(curentData);
  };

  const onTabChange = (tab) => {
    setData(tab, lastInspectionData);
    setSideTab(INITIAL_DATA);
  };

  const getCount = (tabName) => {
    let count = null;
    if (
      inspectionDetailsProps &&
      inspectionDetailsProps.catalogMaster &&
      inspectionDetailsProps.inspectionDetails.length > 0
    ) {
      inspectionDetailsProps.catalogMaster.categories.forEach((item) => {
        if (item.category === tabName) {
          item.subCategories.forEach((subItem) => {
            subItem.checkpoints.forEach((subItemCheckpoint) => {
              if (
                Object.keys(
                  inspectionDetailsProps.inspectionDetails[0].data.checkpoints
                ).length > 0 &&
                inspectionDetailsProps.inspectionDetails[0].data.checkpoints[
                  subItemCheckpoint.key
                ] &&
                inspectionDetailsProps.inspectionDetails[0].data.checkpoints[
                  subItemCheckpoint.key
                ].choices.length > 0 &&
                inspectionDetailsProps.inspectionDetails[0].data.checkpoints[
                  subItemCheckpoint.key
                ].ok === false
              ) {
                count++;
              }
            });
          });
        }
      });
    }
    return count;
  };

  const onChangeAccording = (head) => {
    if (sideTabs[head].expand) {
      setSideTab({
        ...sideTabs,
        [head]: { ...sideTabs[head], expand: false },
      });
    } else {
      setSideTab({
        ...sideTabs,
        [head]: { ...sideTabs[head], expand: true },
      });
    }
  };

  //#endregion Glueish code

  //#region RENDER
  return (
    <>
      {magnifyImg && magnifyImg.path && (
        <div className="background-shadow">
          <div className="sliderMainwrapper">
            <div className="col-3 close">
              <span
                className="close-image-preview"
                onClick={() => setMagnifier("")}
              >
                X
              </span>
            </div>
            <Slider ref={sliderRef} {...sliderSettings}>
              {modalImages.map((image, index) => (
                <TransformWrapper
                  defaultScale={1}
                  defaultPositionX={200}
                  defaultPositionY={100}
                >
                  {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                    <>
                      <div className="row m-0">
                        <div className="col-4"></div>
                        <div className="col-5">
                          <button
                            className="btn btn-primary p-1 px-3 text-white"
                            onClick={() => zoomIn()}
                          >
                            {" "}
                            +{" "}
                          </button>
                          <button
                            className="btn mx-1 my-1 p-1 btn-primary text-white"
                            onClick={() => resetTransform()}
                          >
                            {" "}
                            Reset{" "}
                          </button>
                          <button
                            className="btn btn-primary p-1 px-3 text-white"
                            onClick={() => zoomOut()}
                          >
                            {" "}
                            -{" "}
                          </button>
                          <div className="imageWrapper">
                            <TransformComponent>
                              <img
                                src={image.path}
                                width="550"
                                alt={image.label}
                              />
                            </TransformComponent>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </TransformWrapper>
              ))}
            </Slider>
          </div>
        </div>
      )}

      {/* DISABLED: OLD CODE */}
      {/* {props.showToaster && (
        <AlertBox
          ShowAlert={props.showToaster}
          message={props.toasterMessage}
          type={props.toasterType}
        />
      )} */}
      {props && props.isProcessing && (
        <div className="loaderSection">
          {" "}
          <img src={loaderImg} alt="loader" />
        </div>
      )}
      <div className="col-lg-12 inspection-det-content-wrapper">
        <Link to="/inspection-history-qa" className="back">
          {" "}
          {labels['BACK_BUTTON']} {" "}
        </Link>
        <div className="middleContent">
          <div className="row contentWrapper">
            {appointmentDetails && appointmentDetails.make && (
              <div className="col-lg-3">
                <div className="form-group">
                  <h5>
                    {appointmentDetails.make + " " + appointmentDetails.model}
                  </h5>
                  <span>
                    {appointmentDetails.variant
                      ? appointmentDetails.variant + " | "
                      : ""}
                  </span>
                  <span>
                    {appointmentDetails.fuelType
                      ? appointmentDetails.fuelType
                      : ""}
                  </span>
                  {appointmentDetails.data.derivedStatus === "GREEN_TAG" ||
                  appointmentDetails.data.derivedStatus === "YELLOW_TAG" ||
                  appointmentDetails.data.derivedStatus === "RED_TAG" ||
                  appointmentDetails.data.derivedStatus === "NONE" ? (
                    <span
                      className={
                        appointmentDetails.data.derivedStatus === "NONE"
                          ? "greyLabel"
                          : appointmentDetails.data.derivedStatus ===
                            "GREEN_TAG"
                          ? "greenLabel"
                          : appointmentDetails.data.derivedStatus ===
                            "YELLOW_TAG"
                          ? "yellowLabel"
                          : appointmentDetails.data.derivedStatus === "RED_TAG"
                          ? "redLabel"
                          : ""
                      }
                    >
                      {appointmentDetails.data.derivedStatus
                        ? appointmentDetails.data.derivedStatus.split("_")[0]
                        : ""}
                    </span>
                  ) : null}
                </div>
              </div>
            )}

            <div className="col-lg-3">
              <div className="form-group  bolder-label">
                <label>{labels['INSPECTED_BY']}: </label>
                {appointmentDetails?.createdBy?.uid
                  ? " " + appointmentDetails.createdBy.uid
                  : " N/A"}
              </div>
            </div>

            <div className="col-lg-3">
              <div className="form-group bolder-label">
                <label>{labels['WORKSHOP_NAME']}: </label>
                {appointmentDetails?.loc?.name
                  ? " " + appointmentDetails?.loc?.name
                  : " N/A"}
              </div>
            </div>

            <div className="col-lg-3">
              <div className="form-group bolder-label">
                <label>{labels['ASSIGNED_TO']}: </label>
                <span>
                  {appointmentDetails?.assignedTo?.uid
                    ? " " + appointmentDetails.assignedTo.uid
                    : " None"}
                </span>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-3">
              <div className="form-group bolder-span">
                <label>{labels['APPOINTMENT_ID']}: </label>
                <span>
                  {appointmentDetails?.appointmentId
                    ? " " + appointmentDetails.appointmentId
                    : " N/A"}
                </span>
              </div>
            </div>

            <div className="col-lg-3">
              <div className="form-group bolder-span">
                <label>{labels['INSPECTION_DATE']}: </label>
                <span>
                  {appointmentDetails?.formatedUpdatedAt
                    ? " " + appointmentDetails.formatedUpdatedAt
                    : " N/A"}
                </span>
              </div>
            </div>

            <div className="col-lg-3">
              <div className="form-group bolder-span">
                <label>{labels['ACCEPTABLE_IMPERFECTION']}: </label>
                <span> {accImperfection}</span>
              </div>
            </div>

            <div className="col-lg-3">
              <div className="form-group bolder-span">
                <label>{labels['NON_ACCEPTABLE_IMPERFECTION']}: </label>
                <span> {nonAccImperfection}</span>
              </div>
            </div>
          </div>

          {appointmentDetails &&
          appointmentDetails.locationType === "SERVICE_CENTER" ? (
            <div className="row contentWrapper border-top">
              <div className="col-lg-6">
                <div className="form-group bolder-span cost-center">
                  <label>{labels['APPROVED_ESTIMATE_COST']}: </label>
                  <span>
                    {inspectionSummary &&
                    inspectionSummary.current &&
                    inspectionSummary.current.approved >= 0
                      ? inspectionSummary.current.approved
                      : " N/A"}
                  </span>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="form-group bolder-span cost-center">
                  <label>{labels['TOTAL_REFURB_COST_TILL_NOW']}: </label>
                  <span>
                    {inspectionSummary && inspectionSummary.totalCost >= 0
                      ? inspectionSummary.totalCost
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          ) : null}

          {/* Photo slider starts here*/}
          <div className="row titleWrapper">
            <div className="col-lg-12">
              <div className="photos-row align-items-center d-flex justify-content-between">
                <label>{labels['PHOTOS']}</label>{" "}
                <span>
                {labels['TOTAL']}  Total <strong>{allImages.length}</strong> {labels['PHOTOS']}
                </span>
              </div>
              {allImages && allImages.length > 0 && (
                <div className="row">
                  <div className="photo-container-horiz">
                    {allImages.map((image, index) => (
                      <div className="col-lg-4 photos-slider" key={index}>
                        <img
                          src={image.path}
                          alt={image.label}
                          onClick={() => {
                            imageMagnifier(image, allImages, index);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Photo slider ends here*/}
          {/* Tab view */}
          <div className="tabsSliderWrapper">
            <Slider {...sliderTabSettings}>
              {props &&
                inspectionDetailsProps.catalogMaster &&
                inspectionDetailsProps.catalogMaster.categories &&
                inspectionDetailsProps.catalogMaster.categories.map(
                  (tab, index) => (
                    <div
                      className={`tabs ${
                        tab.category === activeTab && "activeTab"
                      }`}
                      key={index}
                      onClick={() => onTabChange(tab.category)}
                    >
                      {tab.category}{" "}
                      {getCount(tab.category) && (
                        <span className="tabCount">
                          {getCount(tab.category)}
                        </span>
                      )}
                    </div>
                  )
                )}
            </Slider>
          </div>
          <div className="h-line"></div>

          <div className="row">
            <div className="col-lg-3">
              <div className="sideViewWrapper">
                {Object.keys(sideTabs).map(
                  (item, index) =>
                    sideTabs[item].subCategory.length > 0 && (
                      <div className="sideView" key={index}>
                        <h2
                          className={
                            sideTabs[item].expand ? "upArrow" : "downArrow"
                          }
                          onClick={() => onChangeAccording(item)}
                        >
                          {item}
                        </h2>
                        {sideTabs[item].expand && (
                          <ul>
                            {sideTabs[item].subCategory.map(
                              (subItem, subIndex) => (
                                <li
                                  key={subIndex}
                                  onClick={() => moveTo(subItem.header)}
                                >
                                  {subItem.header}
                                </li>
                              )
                            )}
                          </ul>
                        )}
                      </div>
                    )
                )}
              </div>
            </div>
            <div className="col-lg-9">
              {appointmentDetails && appointmentDetails.data && (
                <div className="cardWrapper">
                  <span className="list-header">
                    Imperfections List{" "}
                    {" " + (accImperfection + nonAccImperfection)}
                  </span>
                  {filterednspectionData &&
                    filterednspectionData.map((itemTop, indexTop) => {
                      return (
                        <>
                          {/* List of qualitychecks */}
                          {itemTop.data.qualityChecks &&
                            Object.keys(itemTop.data.qualityChecks).map(
                              (item, index) => {
                                return (
                                  <div
                                    className="container-box-card"
                                    key={index}
                                    ref={
                                      activeSideBar === item
                                        ? currentCardRef
                                        : null
                                    }
                                  >
                                    <label className="label-top">{item}</label>
                                    {appointmentDetails.locationType ===
                                    "FULFILLMENT_CENTER" ? (
                                      <span
                                        className={
                                          appointmentDetails.data.qualityChecks[
                                            item
                                          ]?.tag === "NONE"
                                            ? "greyLabel"
                                            : appointmentDetails.data
                                                .qualityChecks[item]?.tag ===
                                              "GREEN"
                                            ? "greenLabel"
                                            : appointmentDetails.data
                                                .qualityChecks[item]?.tag ===
                                              "YELLOW"
                                            ? "yellowLabel"
                                            : appointmentDetails.data
                                                .qualityChecks[item]?.tag ===
                                              "RED"
                                            ? "redLabel"
                                            : ""
                                        }
                                      >
                                        {
                                          appointmentDetails.data.qualityChecks[
                                            item
                                          ]?.tag
                                        }
                                      </span>
                                    ) : null}
                                    <div className="info-container">
                                      <div className="row">
                                        <div className="col-lg-6">
                                          <div className="row">
                                            <div className="col-lg-12 image-container-history">
                                              {toggleViewHandlerFlag ===
                                              index ? (
                                                <video
                                                  width="100%"
                                                  height="300"
                                                  controls
                                                >
                                                  {itemTop.data.checkpoints[
                                                    item
                                                  ] &&
                                                    itemTop.data.checkpoints[
                                                      item
                                                    ].videos.map(
                                                      (video, index) => {
                                                        return (
                                                          <source
                                                            src={video.path}
                                                            type="video/mp4"
                                                            key={index}
                                                          />
                                                        );
                                                      }
                                                    )}
                                                </video>
                                              ) : (
                                                <Slider {...sliderSettings}>
                                                  {renderImages(itemTop, item)}
                                                </Slider>
                                              )}
                                            </div>
                                          </div>
                                          {itemTop.data.checkpoints[item] &&
                                            itemTop.data.checkpoints[item]
                                              .images &&
                                            itemTop.data.checkpoints[item]
                                              .images.length > 0 && (
                                              <button
                                                className="toggle-view-button"
                                                onClick={() => {
                                                  toggleImageHandler(index);
                                                }}
                                              >
                                                {labels['IMAGE_VIEW']}
                                              </button>
                                            )}
                                          {itemTop.data.checkpoints[item] &&
                                            itemTop.data.checkpoints[item]
                                              .videos &&
                                            itemTop.data.checkpoints[item]
                                              .videos.length > 0 && (
                                              <button
                                                className="toggle-view-button"
                                                onClick={() => {
                                                  toggleVideoHandler(index);
                                                }}
                                              >
                                                {labels['VIDEO_VIEW']}
                                              </button>
                                            )}
                                        </div>
                                        <div className="col-lg-6">
                                          <div className="row">
                                            <div className="col-lg-12">
                                              {itemTop.data.checkpoints[item] &&
                                              itemTop.data.qualityChecks[item]
                                                ?.reason ===
                                                "NO_WORK_TO_BE_DONE" &&
                                              itemTop.data.qualityChecks[item]
                                                ?.status === "APPROVED"
                                                ? "NO WORK TO BE DONE"
                                                : [
                                                    itemTop.data.qualityChecks[
                                                      item
                                                    ]?.status !== "NO_ACTION"
                                                      ? itemTop.data
                                                          .qualityChecks[item]
                                                          ?.status
                                                      : "",
                                                  ]}
                                            </div>
                                            {itemTop.data.checkpoints[item] &&
                                              itemTop.data.checkpoints[item]
                                                .ok === true &&
                                              itemTop.data.checkpoints[item]
                                                .choices.length > 0 && (
                                                <div className="col-lg-12  light-label dark-span textTitle">
                                                  <h6 className="margin-inspection-history">
                                                    {labels['ACCEPTABLE_IMPERFECTION_NOT_SHOWN_TO_CUSTOMER']}
                                                  </h6>
                                                  {itemTop.data.checkpoints[
                                                    item
                                                  ].choices.map((choice) => {
                                                    return choice.acceptable
                                                      ? choice.choice + " | "
                                                      : "";
                                                  })}
                                                </div>
                                              )}

                                            {itemTop.data.checkpoints[item] &&
                                              itemTop.data.checkpoints[item]
                                                .ok === false &&
                                              itemTop.data.checkpoints[item]
                                                .choices.length > 0 && (
                                                <>
                                                  <div className="col-lg-12  light-label dark-span textTitle">
                                                    <h6 className="margin-inspection-history">
                                                      {labels['UNACCEPTABLE_IMPERFECTION_SHOW_TO_CUSTOMER']}
                                                    </h6>
                                                    {itemTop.data.checkpoints[
                                                      item
                                                    ].choices.map((choice) => {
                                                      return !choice.acceptable
                                                        ? choice.choice + " | "
                                                        : "";
                                                    })}
                                                  </div>

                                                  <div className="col-lg-12  light-label dark-span textTitle">
                                                    <h6>
                                                      {labels['ACCEPTABLE_IMPERFECTION_NOT_SHOWN_TO_CUSTOMER']}
                                                    </h6>
                                                    {itemTop.data.checkpoints[
                                                      item
                                                    ].choices.map((choice) => {
                                                      return choice.acceptable
                                                        ? choice.choice + " | "
                                                        : "";
                                                    })}
                                                  </div>
                                                </>
                                              )}

                                            {itemTop.data.checkpoints[item]
                                              .refurbishmentChoices.length >
                                              0 && (
                                              <div className="col-lg-6">
                                                <div className="row">
                                                  <div className="col-lg-6 light-label dark-span borderRight">
                                                    <h6>{labels['WORK_TO_BE_DONE']}</h6>
                                                    <span>
                                                      {itemTop.data.checkpoints[
                                                        item
                                                      ].refurbishmentChoices.map(
                                                        (choice, index) => {
                                                          return (
                                                            <span>
                                                              {index +
                                                                1 +
                                                                ". " +
                                                                choice.refurbishment +
                                                                " "}
                                                            </span>
                                                          );
                                                        }
                                                      )}
                                                    </span>
                                                  </div>
                                                  <div className="col-lg-6 pl20 light-label dark-span">
                                                    {itemTop.data.estimates[
                                                      item
                                                    ] &&
                                                      itemTop.data.estimates[
                                                        item
                                                      ]?.invalidated ===
                                                        false &&
                                                      itemTop.data.estimates[
                                                        item
                                                      ].labourCost >= 0 && (
                                                        <>
                                                          <h6>{labels['LABOUR_COST']}</h6>
                                                          {
                                                            itemTop.data
                                                              .estimates[item]
                                                              .labourCost
                                                          }
                                                        </>
                                                      )}
                                                  </div>
                                                </div>
                                              </div>
                                            )}
                                            {itemTop.data.estimates &&
                                              itemTop.data.estimates[item]
                                                ?.invalidated === false && (
                                                <div className="col-lg-6">
                                                  <div className="row">
                                                    <div className="col-lg-6 pl20 light-label dark-span">
                                                      <h6>{labels['ADDITIONAL_PART']}</h6>
                                                    </div>
                                                    <div className="col-lg-6 pl20 light-label dark-span">
                                                      <h6>{labels['PART_COST']}</h6>
                                                    </div>
                                                  </div>
                                                  {itemTop.data.estimates[
                                                    item
                                                  ]?.parts.map(
                                                    (data, index) => {
                                                      return (
                                                        <div
                                                          className="row"
                                                          key={index}
                                                        >
                                                          <div className="col-lg-6 pl20 light-label dark-span borderRight">
                                                            <span>
                                                              {data.name}
                                                            </span>
                                                          </div>
                                                          <div className="col-lg-6 pl20 light-label dark-span">
                                                            <span>
                                                              {data.cost}
                                                            </span>
                                                          </div>
                                                        </div>
                                                      );
                                                    }
                                                  )}
                                                </div>
                                              )}
                                            {itemTop.data.checkpoints[item]
                                              .ok &&
                                              itemTop.data.checkpoints[item]
                                                .noImperfectionChoices.length >
                                                0 && (
                                                <div className="col-lg-12 card2 light-label dark-span textTitle margin-inspection-history">
                                                  {itemTop.data.checkpoints[
                                                    item
                                                  ].noImperfectionChoices[0] ||
                                                    "OK / No Imperfections"}
                                                </div>
                                              )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                            )}
                          {/* List of checkpoints which is not is qualityChecks */}
                          {itemTop.data.checkpoints &&
                            Object.keys(itemTop.data.checkpoints).map(
                              (item, index) => {
                                return (
                                  <>
                                    {JSON.stringify(
                                      itemTop.data.checkpoints[item]
                                    ) !==
                                      JSON.stringify(
                                        itemTop.data.qualityChecks[item]
                                      ) &&
                                      !itemTop.data.qualityChecks[item] && (
                                        <>
                                          <div
                                            className="container-box-card"
                                            key={index}
                                            ref={
                                              activeSideBar === item
                                                ? currentCardRef
                                                : null
                                            }
                                          >
                                            <label className="label-top">
                                              {item}
                                            </label>
                                            {appointmentDetails.locationType ===
                                            "FULFILLMENT_CENTER" ? (
                                              <span
                                                className={
                                                  appointmentDetails.data
                                                    .qualityChecks[item]
                                                    ?.tag === "NONE"
                                                    ? "greyLabel"
                                                    : appointmentDetails.data
                                                        .qualityChecks[item]
                                                        ?.tag === "GREEN"
                                                    ? "greenLabel"
                                                    : appointmentDetails.data
                                                        .qualityChecks[item]
                                                        ?.tag === "YELLOW"
                                                    ? "yellowLabel"
                                                    : appointmentDetails.data
                                                        .qualityChecks[item]
                                                        ?.tag === "RED"
                                                    ? "redLabel"
                                                    : "greenLabel"
                                                }
                                              >
                                                {appointmentDetails.data
                                                  .qualityChecks[item]?.tag
                                                  ? appointmentDetails.data
                                                      .qualityChecks[item]?.tag
                                                  : "GREEN"}
                                              </span>
                                            ) : null}
                                            <div className="info-container">
                                              <div className="row">
                                                <div className="col-lg-6">
                                                  <div className="row">
                                                    <div className="col-lg-12 image-container-history">
                                                      {toggleViewHandlerFlag ===
                                                      index ? (
                                                        <video
                                                          width="100%"
                                                          height="300"
                                                          controls
                                                        >
                                                          {itemTop.data
                                                            .checkpoints[
                                                            item
                                                          ] &&
                                                            itemTop.data.checkpoints[
                                                              item
                                                            ].videos.map(
                                                              (
                                                                video,
                                                                index
                                                              ) => {
                                                                return (
                                                                  <source
                                                                    src={
                                                                      video.path
                                                                    }
                                                                    type="video/mp4"
                                                                    key={index}
                                                                  />
                                                                );
                                                              }
                                                            )}
                                                        </video>
                                                      ) : (
                                                        <Slider
                                                          {...sliderSettings}
                                                        >
                                                          {renderImages(
                                                            itemTop,
                                                            item
                                                          )}
                                                        </Slider>
                                                      )}
                                                    </div>
                                                  </div>
                                                  {itemTop.data.checkpoints[
                                                    item
                                                  ] &&
                                                    itemTop.data.checkpoints[
                                                      item
                                                    ].images &&
                                                    itemTop.data.checkpoints[
                                                      item
                                                    ].images.length > 0 && (
                                                      <button
                                                        className="toggle-view-button"
                                                        onClick={() => {
                                                          toggleImageHandler(
                                                            index
                                                          );
                                                        }}
                                                      >
                                                        {labels['IMAGE_VIEW']}
                                                      </button>
                                                    )}
                                                  {itemTop.data.checkpoints[
                                                    item
                                                  ] &&
                                                    itemTop.data.checkpoints[
                                                      item
                                                    ].videos &&
                                                    itemTop.data.checkpoints[
                                                      item
                                                    ].videos.length > 0 && (
                                                      <button
                                                        className="toggle-view-button"
                                                        onClick={() => {
                                                          toggleVideoHandler(
                                                            index
                                                          );
                                                        }}
                                                      >
                                                        {labels['VIDEO_VIEW']}
                                                      </button>
                                                    )}
                                                </div>
                                                <div className="col-lg-6">
                                                  <div className="row">
                                                    <div className="col-lg-12">
                                                      {itemTop.data.checkpoints[
                                                        item
                                                      ] &&
                                                      itemTop.data
                                                        .qualityChecks[item]
                                                        ?.reason ===
                                                        "NO_WORK_TO_BE_DONE" &&
                                                      itemTop.data
                                                        .qualityChecks[item]
                                                        ?.status === "APPROVED"
                                                        ? labels['NO_WORK_TO_BE_DONE']
                                                        : itemTop.data
                                                            .qualityChecks[item]
                                                            ?.status}
                                                    </div>
                                                    {itemTop.data.checkpoints[
                                                      item
                                                    ] &&
                                                      itemTop.data.checkpoints[
                                                        item
                                                      ].ok === true &&
                                                      itemTop.data.checkpoints[
                                                        item
                                                      ].choices.length > 0 && (
                                                        <div className="col-lg-12 card light-label dark-span textTitle">
                                                          <h6 className="margin-inspection-history">
                                                            {labels['ACCEPTABLE_IMPERFECTION_NOT_SHOWN_TO_CUSTOMER']}
                                                          </h6>
                                                          {itemTop.data.checkpoints[
                                                            item
                                                          ].choices.map(
                                                            (choice) => {
                                                              return choice.acceptable
                                                                ? choice.choice +
                                                                    " | "
                                                                : "";
                                                            }
                                                          )}
                                                        </div>
                                                      )}

                                                    {itemTop.data.checkpoints[
                                                      item
                                                    ] &&
                                                      itemTop.data.checkpoints[
                                                        item
                                                      ].ok === false &&
                                                      itemTop.data.checkpoints[
                                                        item
                                                      ].choices.length > 0 && (
                                                        <>
                                                          <div className="col-lg-12 card light-label dark-span textTitle">
                                                            <h6 className="margin-inspection-history">
                                                              {labels['UNACCEPTABLE_IMPERFECTION_SHOW_TO_CUSTOMER']}
                                                            </h6>
                                                            {itemTop.data.checkpoints[
                                                              item
                                                            ].choices.map(
                                                              (choice) => {
                                                                return !choice.acceptable
                                                                  ? choice.choice +
                                                                      " | "
                                                                  : "";
                                                              }
                                                            )}
                                                          </div>

                                                          <div className="col-lg-12 card light-label dark-span textTitle">
                                                            <h6>
                                                              {labels['ACCEPTABLE_IMPERFECTION_NOT_SHOWN_TO_CUSTOMER']}
                                                            </h6>
                                                            {itemTop.data.checkpoints[
                                                              item
                                                            ].choices.map(
                                                              (choice) => {
                                                                return choice.acceptable
                                                                  ? choice.choice +
                                                                      " | "
                                                                  : "";
                                                              }
                                                            )}
                                                          </div>
                                                        </>
                                                      )}

                                                    {itemTop.data.checkpoints[
                                                      item
                                                    ].refurbishmentChoices
                                                      .length > 0 && (
                                                      <div className="col-lg-12">
                                                        <div className="row">
                                                          <div className="col-lg-3 light-label dark-span borderRight">
                                                            <h6>
                                                              {labels['WORK_TO_BE_DONE']}
                                                            </h6>
                                                            <span>
                                                              {itemTop.data.checkpoints[
                                                                item
                                                              ].refurbishmentChoices.map(
                                                                (
                                                                  choice,
                                                                  index
                                                                ) => {
                                                                  return (
                                                                    <span>
                                                                      {index +
                                                                        1 +
                                                                        ". " +
                                                                        choice.refurbishment +
                                                                        " "}
                                                                    </span>
                                                                  );
                                                                }
                                                              )}
                                                            </span>
                                                          </div>
                                                          <div className="col-lg-3 pl20 light-label dark-span">
                                                            {itemTop.data
                                                              .estimates[
                                                              item
                                                            ] &&
                                                              itemTop.data
                                                                .estimates[item]
                                                                .invalidated ===
                                                                false &&
                                                              itemTop.data
                                                                .estimates[item]
                                                                .labourCost && (
                                                                <>
                                                                  <h6>
                                                                    {labels['LABOUR_COST']}
                                                                  </h6>
                                                                  {
                                                                    itemTop.data
                                                                      .estimates[
                                                                      item
                                                                    ].labourCost
                                                                  }
                                                                </>
                                                              )}
                                                          </div>
                                                        </div>
                                                      </div>
                                                    )}
                                                    {itemTop.data.estimates &&
                                                      itemTop.data.estimates[
                                                        item
                                                      ] &&
                                                      itemTop.data.estimates[
                                                        item
                                                      ].invalidated ===
                                                        false && (
                                                        <div className="row">
                                                          <div className="col-lg-12">
                                                            {itemTop.data.estimates[
                                                              item
                                                            ]?.parts.map(
                                                              (data, index) => {
                                                                return (
                                                                  <div
                                                                    className="float-div"
                                                                    key={index}
                                                                  >
                                                                    <div>
                                                                      <h6>
                                                                        {labels['ADDITIONAL_PART']}
                                                                      </h6>
                                                                      <span>
                                                                        {
                                                                          data.name
                                                                        }
                                                                      </span>
                                                                    </div>

                                                                    <div>
                                                                      <h6>
                                                                        {labels['PART_COST']}
                                                                      </h6>
                                                                      <span>
                                                                        {
                                                                          data.cost
                                                                        }
                                                                      </span>
                                                                    </div>
                                                                  </div>
                                                                );
                                                              }
                                                            )}
                                                          </div>
                                                        </div>
                                                      )}
                                                    {itemTop.data.checkpoints[
                                                      item
                                                    ].ok &&
                                                      itemTop.data.checkpoints[
                                                        item
                                                      ].noImperfectionChoices
                                                        .length > 0 && (
                                                        <div className="col-lg-12 card light-label dark-span textTitle margin-inspection-history">
                                                          {itemTop.data
                                                            .checkpoints[item]
                                                            .noImperfectionChoices[0] ||
                                                            "OK / No Imperfections"}
                                                        </div>
                                                      )}
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </>
                                      )}
                                  </>
                                );
                              }
                            )}
                        </>
                      );
                    })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
  //#endregion RENDER
};

export default InspectionDetailsComponent;
