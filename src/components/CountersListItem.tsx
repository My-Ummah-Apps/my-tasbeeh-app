import { MdEdit } from "react-icons/md";
import { Link } from "react-router-dom";
import { direction } from "direction";
import { counterObjType } from "../utils/types";
import { useState } from "react";

const CountersListItem = ({
  setAndStoreCounters,
  setEditingCounterId,
  countersArr,
  setShowForm,
  setAddNewCounter,
  nextColor,
  counterItem,
  setActivePage,
}) => {
  return (
    <div className="single-counter-wrap-parent">
      <div
        className="single-counter-wrap"
        style={{
          backgroundColor: nextColor + "BF",
        }}
        onClick={() => {
          setEditingCounterId(counterItem.id);
          const updatedCountersArr: counterObjType[] = countersArr.map(
            (counter: counterObjType) => {
              return counter.id === counterItem.id
                ? { ...counter, isActive: true }
                : { ...counter, isActive: false };
            }
          );
          setAndStoreCounters(updatedCountersArr);
        }}
      >
        <div className="single-counter-name-and-count-wrap">
          <Link
            onClick={() => {
              setActivePage("home");
            }}
            to="/"
            style={{ color: "#fff", textDecoration: "none" }}
          >
            <div className="single-counter-count">
              {counterItem.count} / {counterItem.target}
            </div>

            <div
              style={{
                textAlign:
                  direction(counterItem.counter) === "ltr" ? "left" : "right",
                direction: direction(counterItem.counter),
              }}
              className="single-counter-counter-name"
            >
              {counterItem.counter}
            </div>
          </Link>
        </div>

        <button
          arial-label="Edit Counter"
          className="edit-btn-wrap"
          onClick={(e) => {
            e.stopPropagation();
            setAddNewCounter(false);
            setEditingCounterId(counterItem.id);
            setShowForm(true);
          }}
        >
          <MdEdit />
        </button>
        <div
          className="single-counter-overlay"
          style={{
            backgroundColor: nextColor,
            width: (counterItem.count / counterItem.target) * 100 + "%",
          }}
        ></div>
      </div>
    </div>
  );
};

export default CountersListItem;
