    import React, { useState, useEffect, useMemo, useContext } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { jwtDecode } from 'jwt-decode'; 
    import axios from 'axios'; 
    // FIX: This import will now work because you created the file above
    import { useAuth } from '../context/AuthContext'; 

    // --- Import Chart.js ---
    import {
      Chart as ChartJS, CategoryScale, LinearScale, BarElement,
      Title, Tooltip, Legend, PointElement, LineElement, ArcElement,
    } from 'chart.js';
    import { Line, Doughnut, Bar } from 'react-chartjs-2';
    ChartJS.register(
      CategoryScale,
      LinearScale,
      BarElement,
      Title,
      Tooltip,
      Legend,
      PointElement,
      LineElement,
      ArcElement
    );

    // --- Import React Bootstrap ---
    import {
      Spinner, Alert, Card, Table, Button, Form, Modal, InputGroup, Badge,
      ListGroup, Row, Col
    } from 'react-bootstrap';

    // -------------------------------------------------------------------
    // --- INLINE SVG ICONS (Replaces react-bootstrap-icons) ---
    // -------------------------------------------------------------------
    const ICONS = {
      GridFill: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16"><path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3A1.5 1.5 0 0 1 15 10.5v3A1.5 1.5 0 0 1 13.5 15h-3A1.5 1.5 0 0 1 9 13.5v-3z"/></svg>,
      PatchCheckFill: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16"><path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638.89.011a2.89 2.89 0 0 1 2.924 2.924l.01.89.638-.622a2.89 2.89 0 0 0 0-4.134l-.638-.622z"/><path d="M2.163 11.076a2.89 2.89 0 0 0 0 4.134l.622.638-.89-.011a2.89 2.89 0 0 1-2.924-2.924l-.01-.89-.638.622a2.89 2.89 0 0 0 0 4.134l.638.622zm11.674-1.19a2.89 2.89 0 0 0-4.134 0l.622.638.89.011a2.89 2.89 0 0 1 2.924 2.924l.01.89.638-.622a2.89 2.89 0 0 0 0-4.134l-.638-.622z"/><path d="M8.5 1.866a1 1 0 1 0-1 0V3h-2v1h2v2h1V4h2V3H8.5V1.866zM13.854 7.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 13.793l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>,
      PersonSquare: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16"><path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/><path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM4 11.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm.5 2.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5z"/></svg>,
      PeopleFill: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16"><path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/><path fillRule="evenodd" d="M5.216 14A2.238 2.238 0 0 1 5 13c0-1.105.895-2 2-2s2 .895 2 2c0 .39-.11.74-.285 1.041-.176.29-.413.558-.715.791zM11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/><path d="M2 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H2zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/></svg>,
      Bank: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16"><path d="M8 .95 1.75 4h12.5L8 .95zM0 4v1h16V4H0zM1 14h14v-7H1v7zm2-6h2v4H3V8zm4 0h2v4H7V8zm4 0h2v4h-2V8z"/></svg>,
      ExclamationTriangleFill: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16"><path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg>,
      MegaphoneFill: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16"><path d="M13 2.5a1.5 1.5 0 0 1 1.11 2.457l-1.006 1.006c.03.041.06.082.09.123l.007.01a.75.75 0 0 1 0 1.06l-.007.01a1.13 1.13 0 0 1-.09.123l1.006 1.006A1.5 1.5 0 0 1 13 9.5H2.561l-1.07 1.07a.5.5 0 0 1-.708-.708L2.293 8.354a.5.5 0 0 1 .708 0l.646.647.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.001.0m2.023 2.023a.75.75 0 0 1 0-1.06l.007-.01c.28-.28.62-.44.99-.44.37 0 .71.16.99.44l.007.01c.28.28.44.62.44.99 0 .37-.16.71-.44.99l-.007.01a.75.75 0 0 1-1.06 0l-.007-.01a1.13 1.13 0 0 1-.123-.09l-1.006-1.006a1.13 1.13 0 0 1-.123-.09l-.01-.007.01-.007z"/></svg>,
      ChatLeftTextFill: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16"><path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414a1 1 0 0 0-.707.293L.854 15.146A.5.5 0 0 1 0 14.793V2zm3.5 1a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5z"/></svg>,
      GearFill: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16"><path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.308c.43.78 0 1.77-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.308-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.308a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413-1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.308.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.858 2.929 2.929 0 0 1 0 5.858z"/></svg>,
      BoxArrowRight: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2.5a.5.5 0 0 0 1 0v-2.5a1.5 1.5 0 0 0-1.5-1.5h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2.5a.5.5 0 0 0-1 0v2.5z"/><path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/></svg>,
      List: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/></svg>,
      EyeFill: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16"><path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/><path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/></svg>,
      LockFill: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16"><path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/></svg>,
      UnlockFill: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16"><path d="M11 1a2 2 0 0 0-2 2v4H7V3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H7V3a2 2 0 0 0-2 2v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/></svg>,
      TrashFill: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16"><path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/></svg>,
      ReplyFill: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16"><path d="M5.921 11.9 1.353 8.62a.719.719 0 0 1 0-1.239L5.921 4.1A.716.716 0 0 1 7 4.719V6.5c1.5 0 2.97.256 4.187.791a.7.7 0 0 1 .425.66c.027.564.09.91.163 1.204.033.137.06.273.082.41a.7.7 0 0 1-.576.707c-1.358.5-2.75.71-4.277.71v1.78a.716.716 0 0 1-1.079.62z"/></svg>,
      PlusCircleFill: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/></svg>,
      PencilFill: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16"><path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/></svg>,
      StarFill: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16"><path d="M3.612 15.443c-.346.196-.688-.28-.363-.618l1.9-4.133-3.001-2.922c-.31-.303-.162-.83.285-.886l4.144-.604L8.55 3.203c.178-.358.506-.358.684 0l1.855 3.766 4.144.604c.447.056.595.583.285.886l-3.001 2.922 1.9 4.133c.325.338-.017.814-.363.618L8.25 13.328l-3.638 2.115z"/></svg>,
      Search: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>,
      CheckCircleFill: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/></svg>,
      XCircleFill: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/></svg>,
      ArrowLeftCircle: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/></svg>,
      CurrencyRupee: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16"><path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.589 3.465-3.71C10.41 2.501 8.982 1 6.728 1H4v2.06z"/></svg>,
      BoxSeamFill: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M15.528 2.972a.75.75 0 0 1 .472.696v8.662a.75.75 0 0 1-.472.696l-6.25 3.125a.75.75 0 0 1-.557 0L2.472 13.028a.75.75 0 0 1-.472-.696V3.668a.75.75 0 0 1 .472-.696L8.72.147a.75.75 0 0 1 .557 0l6.25 3.125zM8 9.773l5.5-2.75L8 4.274 2.5 7.023 8 9.773zM1.5 3.875v8.25l6 3v-8.25l-6-3zm13 0l-6 3v8.25l6-3v-8.25z"/></svg>,
      Shop: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16"><path d="M2.97 1.35A1 1 0 0 1 3.73 1h8.54a1 1 0 0 1 .76.35l2.609 3.044A1.5 1.5 0 0 1 16 5.37v.13h-1v-.13a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.13H0v-.13a1.5 1.5 0 0 1 .404-1.008L2.97 1.35zM12 12.75c.621 0 1.156-.025 1.763-.072C14.64 12.63 16 11.13 16 9.577V5.37a1.5 1.5 0 0 1-.404-1.008L13.487 1H2.513L.404 4.362A1.5 1.5 0 0 1 0 5.37v4.207c0 1.553 1.36 3.053 2.237 3.122C2.844 12.725 3.379 12.75 4 12.75h8zM1 9.35c0 .329.12.65.347.936C1.754 10.66 2.66 11.237 4 11.737c1.45.521 3.18.68 5.96.68s4.51-.159 5.96-.68c1.34-.5 2.246-1.077 2.653-1.451C14.88 10 15 9.678 15 9.35V6H1v3.35zM4 13.5c-.621 0-1.156.025-1.763.072C1.36 13.62 0 14.87 0 16.5v.5h16v-.5c0-1.63-1.36-2.88-2.237-2.928C13.156 13.525 12.621 13.5 12 13.5H4z"/></svg>,
    FileEarmarkPdfFill: (p) => <svg {...p} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16"><path d="M5.523 12.424q.21-.124.459-.238a8.03 8.03 0 0 1-.45.606c-.28.337-.498.516-.635.572a.266.266 0 0 1-.035.012.282.282 0 0 1-.026-.044c-.035-.061-.054-.116-.054-.18a.6.6 0 0 1 .042-.235c.03-.06.075-.12.13-.183.056-.063.12-.12.193-.173a.878.878 0 0 1 .206-.135Zm.21.68c.116.03.23.045.343.045.143 0 .28-.024.41-.073.13-.05.25-.11.354-.176.104-.067.192-.14.263-.22.07-.08.122-.164.156-.253a.7.7 0 0 0 .042-.26c0-.12-.017-.23-.051-.328a.7.7 0 0 0-.153-.255c-.09-.13-.2-.234-.326-.314a.97.97 0 0 0-.469-.177.9.9 0 0 0-.46.12c-.12.068-.225.15-.314.25a.8.8 0 0 0-.206.33c-.05.124-.075.254-.075.389 0 .12.018.23.054.33.036.1.08.183.13.25.05.068.106.12.164.156.059.036.116.059.17.068Zm.247.45h.002a.2.2 0 0 1-.002 0Z"/><path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/><path d="M4.603 14.087a.81.81 0 0 1-.438-.42c-.108-.141-.158-.3-1.096-2.484C2.001 8.81 2 8.69 2 8.5V8c0-.09.001-.18.006-.276a.5.5 0 0 1 .099-.1.5.5 0 0 1 .09-.068.5.5 0 0 1 .11-.032c.08-.01.144-.017.183-.017.07 0 .134.007.18.02.064.017.11.04.13.07a.14.14 0 0 1 .07.094c.012.03.018.06.018.092a.84.84 0 0 1-.03.265c-.01.075-.023.14-.04.195a.7.7 0 0 1-.05.153c-.02.05-.04.09-.064.12-.03.04-.06.07-.086.09-.03.017-.07.03-.106.03-.05 0-.098-.005-.142-.014a.3.3 0 0 1-.118-.042c-.03-.026-.05-.06-.062-.092.018.142.03.264.037.368.007.104.007.21.007.316a.7.7 0 0 1-.02.15c-.012.06-.027.11-.046.15q-.02.04-.045.07c-.03.03-.066.05-.108.066-.04.017-.083.02-.128.02-.05 0-.09-.004-.12-.013a.3.3 0 0 1-.08-.039.3.3 0 0 1-.06-.05c-.02-.017-.027-.038-.027-.063a.8.8 0 0 1 .01-.077.5.5 0 0 1 .048-.097c.03-.036.06-.06.09-.074.03-.016.06-.022.09-.022.03 0 .06.004.084.012.024.008.04.02.05.036.01.017.01.038.01.064a.6.6 0 0 1-.01.136.5.5 0 0 1-.04.13c-.03.04-.06.07-.1.09a.3.3 0 0 1-.116.05c-.04.01-.08.013-.12.013-.04 0-.08-.004-.11-.013a.3.3 0 0 1-.08-.04.3.3 0 0 1-.06-.05c-.02-.02-.027-.04-.027-.063a.8.8 0 0 1 .01-.077.5.5 0 0 1 .048-.097c.03-.036.06-.06.09-.074.03-.016.06-.022.09-.022.03 0 .06.004.084.012.024.008.04.02.05.036.01.017.01.038.01.064a.6.6 0 0 1-.01.136.5.5 0 0 1-.04.13c-.03.04-.06.07-.1.09a.3.3 0 0 1-.116.05c-.04.01-.08.013-.12.013a.8.8 0 0 1-.144-.014.3.3 0 0 1-.104-.04A.3.3 0 0 1 3.5 13c-.017-.017-.03-.038-.037-.064a.8.8 0 0 1 .01-.077.5.5 0 0 1 .048-.097c.03-.036.06-.06.09-.074.03-.016.06-.022.09-.022.03 0 .06.004.084.012.024.008.04.02.05.036.01.017.01.038.01.064a.6.6 0 0 1-.01.136.5.5 0 0 1-.04.13c-.03.04-.06.07-.1.09a.3.3 0 0 1-.116.05c-.04.01-.08.013-.12.013Z"/></svg>,
    
  };

    // -------------------------------------------------------------------
    // --- STYLES ---
    // -------------------------------------------------------------------
    const GlobalStyles = () => (
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        :root {
          --brand-primary: #6c56d0;
          --brand-light: #f4f2ff;
          --text-dark: #222;
          --text-light: #555;
          --border-color: #e0e0e0;
          --bg-light-grey: #f7f8fa;
          --sidebar-width: 260px;
          --sidebar-width-collapsed: 90px;
          --header-height: 70px;
        }
        .admin-layout-container {
          margin: 0;
          font-family: 'Inter', sans-serif;
          background-color: var(--bg-light-grey);
        }
        .admin-layout-container .card {
            border: none;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            border-radius: 0.75rem;
        }
        /* Soft colors for stat card icons */
        .bg-primary-soft { background-color: rgba(108, 86, 208, 0.1); }
        .text-primary { color: var(--brand-primary) !important; }
        .bg-success-soft { background-color: rgba(25, 135, 84, 0.1); }
        .text-success { color: #198754 !important; }
        .bg-info-soft { background-color: rgba(13, 202, 240, 0.1); }
        .text-info { color: #0dcaf0 !important; }
        .bg-warning-soft { background-color: rgba(255, 193, 7, 0.1); }
        .text-warning { color: #ffc107 !important; }

        .icon-circle {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }
        
        .admin-layout { display: flex; min-height: 100vh; }
        .sidebar {
          width: var(--sidebar-width);
          background-color: #ffffff;
          border-right: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          padding: 1.5rem;
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          z-index: 1000;
          transition: width 0.3s ease, left 0.3s ease;
          overflow-x: hidden;
        }
        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #f0f0f0;
          margin-bottom: 1rem;
          text-decoration: none;
        }
        .sidebar-logo-img {
          height: 32px;
          width: 32px;
          object-fit: cover;
          border-radius: 8px;
          flex-shrink: 0;
        }
        .sidebar-logo-text {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-dark);
          opacity: 1;
          transition: opacity 0.2s ease;
          white-space: nowrap;
          margin-left: 10px;
        }
        .sidebar-nav {
          flex-grow: 1;
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .nav-item { margin-bottom: 0.5rem; }
        .nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 500;
          color: var(--text-light);
          transition: background-color 0.2s ease, color 0.2s ease;
          cursor: pointer;
          white-space: nowrap;
        }
        .nav-link .nav-icon {
          font-size: 1.2rem;
          width: 24px;
          text-align: center;
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .nav-link-text {
          opacity: 1;
          transition: opacity 0.2s ease;
        }
        .nav-link:hover {
          background-color: var(--brand-light);
          color: var(--brand-primary);
        }
        .nav-link.active {
          background-color: var(--brand-primary);
          color: #ffffff;
        }
        .sidebar-footer {
          margin-top: auto;
          padding-top: 1rem;
          border-top: 1px solid #f0f0f0;
          list-style: none;
          padding-left: 0;
        }
        .sidebar-footer .nav-link:hover {
          background-color: #fff8f8;
          color: #dc3545;
        }
        .header {
          height: var(--header-height);
          background-color: #ffffff;
          border-bottom: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.5rem;
          position: fixed;
          top: 0;
          right: 0;
          left: var(--sidebar-width);
          z-index: 900;
          transition: left 0.3s ease;
        }
        .header-toggle {
          font-size: 1.5rem;
          color: #333;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .header-right {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        .profile-dropdown {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }
        .profile-img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }
        .profile-name { font-weight: 600; color: #333; }
        .main-content {
          flex-grow: 1;
          padding: 1.5rem;
          margin-left: var(--sidebar-width);
          margin-top: var(--header-height);
          transition: margin-left 0.3s ease;
        }
        .page-title {
          font-size: 1.6rem;
          font-weight: 700;
          color: #222;
          margin-bottom: 1.5rem;
        }
        .full-page-loader {
          display: flex; 
          justify-content: center; 
          align-items: center; 
          height: 70vh;
        }
        .sidebar-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 950;
        }
        @media (min-width: 992px) {
          .admin-layout.sidebar-closed .sidebar { width: var(--sidebar-width-collapsed); }
          .admin-layout.sidebar-closed .sidebar-logo-text,
          .admin-layout.sidebar-closed .nav-link-text { opacity: 0; pointer-events: none; }
          .admin-layout.sidebar-closed .nav-link { justify-content: center; }
          .admin-layout.sidebar-closed .header { left: var(--sidebar-width-collapsed); }
          .admin-layout.sidebar-closed .main-content { margin-left: var(--sidebar-width-collapsed); }
        }
        /* FIX: Mobile view padding */
        @media (max-width: 991px) {
          .header { left: 0; padding: 0 1rem; }
          .main-content { 
            margin-left: 0; 
            padding: 1rem 0.75rem; 
          }
          .profile-info { display: none; }
          .sidebar { left: calc(var(--sidebar-width) * -1); z-index: 1100; }
          .admin-layout.sidebar-open .sidebar { left: 0; }
          .admin-layout.sidebar-open .sidebar-overlay { display: block; }
        }
      `}</style>
    );

    // -------------------------------------------------------------------
    // --- HELPER COMPONENTS ---
    // -------------------------------------------------------------------

// -------------------------------------------------------------------
// --- STATIC CHART DATA ---
// -------------------------------------------------------------------

// Example data for the Line chart
const staticGrowthData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Revenue',
      data: [6500, 5900, 8000, 8100, 5600, 5500, 4000],
      fill: true,
      borderColor: 'rgb(108, 86, 208)', // --brand-primary
      backgroundColor: 'rgba(108, 86, 208, 0.2)',
      tension: 0.1,
    },
  ],
};

// Example data for the Doughnut chart
const staticPaymentData = {
  labels: ['Online Payment', 'Cash on Delivery', 'Wallet'],
  datasets: [
    {
      label: 'Payment Methods',
      data: [300, 50, 100], // Static values
      backgroundColor: [
        'rgba(108, 86, 208, 0.8)', // --brand-primary
        'rgba(255, 193, 7, 0.8)',  // --warning
        'rgba(13, 202, 240, 0.8)',   // --info
      ],
      borderColor: ['#fff', '#fff', '#fff'],
      borderWidth: 2,
    },
  ],
};

const formatCurrency = (amount) => {
      if (typeof amount !== 'number') amount = Number(amount) || 0;
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
    };


    const formatDateTime = (dateString) => {
      if (!dateString) return 'N/A';
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';
        return date.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' });
      } catch (e) { return 'N/A'; }
    };

    const Loader = () => (
      <div className="full-page-loader">
        <Spinner animation="border" variant="primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );

    const StatCard = ({ title, value, icon, color = 'primary', change }) => {
      const IconComponent = ICONS[icon] || ICONS.QuestionCircleFill;
      return (
        <Card className="h-100">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h6 className="text-muted text-uppercase small">{title}</h6>
                <h4 className="fw-bold mb-0">{value}</h4>
              </div>
              <div className={`icon-circle bg-${color}-soft text-${color} rounded-circle`}>
                <IconComponent style={{ fontSize: '1.5rem' }} />
              </div>
            </div>
            {change && (
              <div className={`mt-2 text-${change && change.startsWith('+') ? 'success' : 'danger'} small`}>
                <span className="fw-medium">{change}</span>
                <span className="text-muted"> vs. last month</span>
              </div>
            )}
          </Card.Body>
        </Card>
      );
    };

    const DataChart = ({ type, data, options }) => {
      const defaultOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } } };
      const chartOptions = { ...defaultOptions, ...options };
      return (
        <div style={{ position: 'relative', height: '350px' }}>
          {type === 'line' && <Line data={data} options={chartOptions} />}
          {type === 'bar' && <Bar data={data} options={chartOptions} />}
          {type === 'doughnut' && <Doughnut data={data} options={chartOptions} />}
        </div>
      );
    };

    const ComplaintReplyModal = ({ show, handleClose, complaint, onSendReply, api }) => {
      const [replyText, setReplyText] = useState('');
      const [isSending, setIsSending] = useState(false);

      const handleSend = async () => {
        if (!replyText) return;
        setIsSending(true);
        try {
          await api.post(`/admin/complaints/${complaint._id}/reply`, { replyText });
          onSendReply(complaint._id, replyText);
          setReplyText('');
          handleClose();
        } catch (err) {
          alert('Failed to send reply. Please try again.');
        } finally {
          setIsSending(false);
        }
      };

      return (
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton><Modal.Title>Reply to Complaint</Modal.Title></Modal.Header>
          <Modal.Body>
            <p><strong>User:</strong> {complaint?.user?.email || 'N/A'}</p>
            <p><strong>Subject:</strong> {complaint?.subject}</p>
            <p><strong>Complaint:</strong> {complaint?.description}</p>
            <hr />
            <Form.Group>
              <Form.Label>Your Reply</Form.Label>
              <Form.Control as="textarea" rows={5} value={replyText} onChange={(e) => setReplyText(e.target.value)} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Cancel</Button>
            <Button variant="primary" onClick={handleSend} disabled={isSending}>
              {isSending ? <Spinner as="span" size="sm" /> : 'Send Reply'}
            </Button>
          </Modal.Footer>
        </Modal>
      );
    };

    const RestaurantDetailView = ({ restaurant }) => (
      <Card>
        <Card.Header><h5 className="card-title mb-0">Application Details</h5></Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}><strong className="text-muted d-block">Shop Name</strong><p>{restaurant.shopName}</p></Col>
            <Col md={6}><strong className="text-muted d-block">Shop Address</strong><p>{restaurant.shopAddress}</p></Col>
            <Col md={6}><strong className="text-muted d-block">Owner Name</strong><p>{restaurant.name}</p></Col>
            <Col md={6}><strong className="text-muted d-block">Owner Email</strong><p>{restaurant.email}</p></Col>
            <Col md={6}><strong className="text-muted d-block">Owner Phone</strong><p>{restaurant.phone}</p></Col>
            <Col md={6}><strong className="text-muted d-block">Status</strong><p><Badge bg="warning">{restaurant.status}</Badge></p></Col>
          </Row>
          <h6 className="mt-3">Documents</h6>
          <ListGroup>
            <ListGroup.Item>
              <a href={restaurant.fssaiDocUrl || '#'} target="_blank" rel="noopener noreferrer">
                <ICONS.FileEarmarkPdfFill className="me-2" /> FSSAI Document
              </a>
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>
    );

    // -------------------------------------------------------------------
    // --- PAGE COMPONENTS (MODIFIED) ---
    // -------------------------------------------------------------------

    // --- DashboardPage ---
    const DashboardPage = ({ api }) => {
      const [stats, setStats] = useState(null);
      const [transactions, setTransactions] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      useEffect(() => {
        const fetchData = async () => {
          if (!api) return; 
          try {
            setLoading(true);
            const { data } = await api.get('/admin/dashboard-data');
            setStats(data.stats);
            setTransactions(data.recentTransactions);
            setError(null);
          } catch (err) {
            setError("Could not load dashboard data. The backend might be offline.");
            console.error(err);
          } finally {
            setLoading(false);
          }
        };
        fetchData();
      }, [api]); 

      if (loading) return <Loader />;
      if (error) return <Alert variant="danger">{error}</Alert>;

      const { totalRevenue = 0, totalOrders = 0, newCustomers = 0, pendingRestaurants = 0, revenueChange = '+0%', ordersChange = '+0%', customersChange = '+0%' } = stats || {};
const growthData = staticGrowthData;
const paymentData = staticPaymentData;
      const hasPaymentData = paymentData?.datasets?.[0]?.data?.some(val => val > 0);

      return (
        <div>
          <h1 className="page-title">Dashboard Overview</h1>
          <Row className="g-4 mb-4">
            <Col lg={3} md={6}><StatCard title="Total Revenue" value={formatCurrency(totalRevenue)} icon="CurrencyRupee" color="success" change={revenueChange} /></Col>
            <Col lg={3} md={6}><StatCard title="Total Orders" value={totalOrders.toLocaleString('en-IN')} icon="BoxSeamFill" color="primary" change={ordersChange} /></Col>
            <Col lg={3} md={6}><StatCard title="New Customers" value={newCustomers.toLocaleString('en-IN')} icon="PeopleFill" color="info" change={customersChange} /></Col>
            <Col lg={3} md={6}><StatCard title="Pending Restaurants" value={pendingRestaurants} icon="Shop" color="warning" /></Col>
          </Row>
          <Row className="g-4 mb-4">
            <Col lg={8}><Card className="h-100"><Card.Body><h5 className="card-title">Growth Overview</h5><DataChart type="line" data={growthData} /></Card.Body></Card></Col>
            <Col lg={4}>
              <Card className="h-100">
                <Card.Body>
                  <h5 className="card-title">Payments Overview</h5>
                  {hasPaymentData ? (
                    <DataChart type="doughnut" data={paymentData} />
                  ) : (
                    <div className="d-flex align-items-center justify-content-center text-center" style={{ minHeight: '300px' }}>
                      <p className="text-muted">No transactions done!</p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Card>
            <Card.Header className="bg-white border-0 py-3"><h5 className="card-title mb-0">Recent Transactions</h5></Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="align-middle mb-0">
                <thead className="table-light"><tr><th>ID</th><th>Customer</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx._id}>
                      <td className="fw-bold py-3 px-3">{tx._id.slice(-6)}</td>
                      <td className="py-3 px-3">{tx.customer?.name || 'N/A'}</td>
                      <td className="py-3 px-3">{formatCurrency(tx.totalAmount)}</td>
                      <td className="py-3 px-3"><Badge bg={tx.status === 'Completed' ? 'success' : 'warning'}>{tx.status}</Badge></td>
                      <td className="py-3 px-3">{formatDateTime(tx.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </div>
      );
    };

    // --- RestaurantVerificationPage ---
    const RestaurantVerificationPage = ({ setActivePage, api }) => {
      const [restaurants, setRestaurants] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      useEffect(() => {
        const fetchRestaurants = async () => {
          if (!api) return;
          try {
            setLoading(true);
            const { data } = await api.get('/admin/owners?status=pending');
            setRestaurants(data || []);
            setError(null);
          } catch (err) {
            setError('Failed to fetch restaurant applications.');
            setRestaurants([]);
          } finally {
            setLoading(false);
          }
        };
        fetchRestaurants();
      }, [api]);

      if (loading) return <Loader />;
      if (error) return <Alert variant="danger">{error}</Alert>;

      return (
        <div>
          <h1 className="page-title">Restaurant Verification</h1>
          <Card>
            <Card.Header><h5 className="card-title mb-0">Pending Applications</h5></Card.Header>
            <Card.Body>
              {restaurants.length === 0 ? (
                <Alert variant="info" className="text-center">No pending applications found.</Alert>
              ) : (
                <Table responsive hover className="align-middle">
                  <thead><tr><th>Restaurant</th><th>Owner</th><th>Status</th><th>Submitted</th><th>Actions</th></tr></thead>
                  <tbody>
                    {restaurants.map(r => (
                      <tr key={r._id}>
                        <td className="fw-bold">{r.shopName}</td>
                        <td>{r.name}</td>
                        <td><Badge bg={'warning'}>{r.status}</Badge></td>
                        <td>{formatDateTime(r.createdAt)}</td>
                        <td>
                          <Button variant="primary" size="sm" onClick={() => setActivePage(`verification-details:${r._id}`)}>
                            <ICONS.EyeFill className="me-1" /> Review
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </div>
      );
    };

    // --- RestaurantDetailsPage (Verification Detail) ---
    const RestaurantDetailsPage = ({ restaurantId, setActivePage, api }) => {
      const [restaurant, setRestaurant] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [isSubmitting, setIsSubmitting] = useState(false);
      const [rejectionReason, setRejectionReason] = useState('');

      useEffect(() => {
        const fetchRestaurantDetails = async () => {
          if (!api) return;
          try {
            setLoading(true);
            const { data } = await api.get(`/admin/owners/${restaurantId}`);
            setRestaurant(data);
            setError(null);
          } catch (err) {
            setError('Failed to fetch application details.');
          } finally {
            setLoading(false);
          }
        };
        fetchRestaurantDetails();
      }, [restaurantId, api]);

      const handleApprove = async () => {
        setIsSubmitting(true);
        try {
          await api.put(`/admin/owners/${restaurantId}/approve`);
          alert('Restaurant Approved!');
          setActivePage('verification');
        } catch (err) {
          alert('Failed to approve. Please try again.');
        } finally {
          setIsSubmitting(false);
        }
      };

      const handleReject = async () => {
        if (!rejectionReason) return alert("Please provide a reason.");
        setIsSubmitting(true);
        try {
          await api.put(`/admin/owners/${restaurantId}/reject`, { reason: rejectionReason });
          alert(`Restaurant Rejected.`);
          setActivePage('verification');
        } catch (err) {
          alert('Failed to reject. Please try again.');
        } finally {
          setIsSubmitting(false);
        }
      };

      if (loading) return <Loader />;
      if (error) return <Alert variant="danger">{error}</Alert>;
      if (!restaurant) return <Alert variant="warning">No application found.</Alert>;

      return (
        <div>
          <Button variant="outline-secondary" className="mb-3" onClick={() => setActivePage('verification')}>
            <ICONS.ArrowLeftCircle className="me-2" />Back to List
          </Button>
          <h1 className="page-title">Review Application: {restaurant?.shopName}</h1>
          <RestaurantDetailView restaurant={restaurant} />
          {restaurant.status === 'pending' && (
            <Card className="mt-4">
              <Card.Header><h5 className="card-title mb-0">Admin Actions</h5></Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Rejection Reason (Required if rejecting)</Form.Label>
                  <Form.Control as="textarea" rows={3} value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} />
                </Form.Group>
                <div className="d-flex gap-2">
                  <Button variant="success" size="lg" onClick={handleApprove} disabled={isSubmitting}><ICONS.CheckCircleFill className="me-2" />Approve</Button>
                  <Button variant="danger" size="lg" onClick={handleReject} disabled={isSubmitting || !rejectionReason}><ICONS.XCircleFill className="me-2" />Reject</Button>
                </div>
              </Card.Body>
            </Card>
          )}
        </div>
      );
    };

    // --- OwnersListPage ---
    const OwnersListPage = ({ setActivePage, api }) => {
      const [owners, setOwners] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [searchTerm, setSearchTerm] = useState('');

      const fetchOwners = async () => {
        if (!api) return;
        try {
          setLoading(true);
          const { data } = await api.get('/admin/owners?status=approved,blocked');
          setOwners(data || []);
          setError(null);
        } catch (err) {
          setError('Failed to fetch owners.');
          setOwners([]);
        } finally {
          setLoading(false);
        }
      };

      useEffect(() => {
        fetchOwners();
      }, [api]);

      const handleBlockToggle = async (ownerId, currentStatus) => {
        const newStatus = currentStatus === 'approved' ? 'blocked' : 'approved';
        try {
          await api.put(`/admin/owners/${ownerId}/toggle-status`, { status: newStatus });
          fetchOwners(); // Refresh
        } catch (err) {
          alert(`Failed to ${newStatus} owner.`);
        }
      };

      const filteredOwners = owners.filter(o =>
        (o.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (o.shopName || '').toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (loading) return <Loader />;
      if (error) return <Alert variant="danger">{error}</Alert>;

      return (
        <div>
          <h1 className="page-title">Restaurant Owners</h1>
          <Card>
            <Card.Header className="bg-white border-0 pt-3">
              <InputGroup style={{ maxWidth: '300px' }}>
                <InputGroup.Text><ICONS.Search /></InputGroup.Text>
                <Form.Control placeholder="Search by name or shop..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </InputGroup>
            </Card.Header>
            <Card.Body>
              {filteredOwners.length === 0 ? (
                <Alert variant="info" className="text-center">No owners found.</Alert>
              ) : (
                <Table responsive hover>
                  <thead><tr><th>Name</th><th>Restaurant</th><th>Email</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {filteredOwners.map(owner => (
                      <tr key={owner._id}>
                        <td className="fw-bold">{owner.name}</td>
                        <td>{owner.shopName}</td>
                        <td>{owner.email}</td>
                        <td><Badge bg={owner.status === 'approved' ? 'success' : 'danger'}>{owner.status}</Badge></td>
                        <td>
                          <Button onClick={() => setActivePage(`owner-details:${owner._id}`)} variant="primary" size="sm" className="me-2"><ICONS.EyeFill /></Button>
                          <Button variant={owner.status === 'approved' ? 'warning' : 'success'} size="sm" onClick={() => handleBlockToggle(owner._id, owner.status)}>
                            {owner.status === 'approved' ? <ICONS.LockFill /> : <ICONS.UnlockFill />}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </div>
      );
    };

    // --- OwnerDetailsPage ---
    const OwnerDetailsPage = ({ ownerId, setActivePage, api }) => {
      const [owner, setOwner] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [commission, setCommission] = useState('');
      const [isSavingComm, setIsSavingComm] = useState(false);

      const fetchOwnerDetails = async () => {
        if (!api) return;
        try {
          setLoading(true);
          const { data } = await api.get(`/admin/owners/${ownerId}`);
          setOwner(data);
          setCommission(data.commissionRate || '10'); 
          setError(null);
        } catch (err) {
          setError('Failed to fetch owner details. The API endpoint might be offline.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      
      useEffect(() => {
        fetchOwnerDetails();
      }, [ownerId, api]);

      const handleSaveCommission = async () => {
        setIsSavingComm(true);
        try {
          await api.put(`/admin/owners/${ownerId}/commission`, { 
            commissionRate: Number(commission) 
          });
          alert('Commission rate saved!');
          fetchOwnerDetails();
        } catch (err) {
          alert('Failed to save commission rate.');
          console.error(err);
        } finally {
          setIsSavingComm(false);
        }
      };

      const handleDelete = async () => {
        if (window.confirm('Are you sure you want to permanently delete this owner?')) {
          try {
            await api.delete(`/admin/owners/${ownerId}`);
            alert('Owner deleted.');
            setActivePage('owners');
          } catch (err) {
            alert('Failed to delete owner.');
          }
        }
      };

      if (loading) return <Loader />;
      if (error) return <Alert variant="danger">{error}</Alert>;
      if (!owner) return <Alert variant="warning">Owner not found.</Alert>;

      return (
        <div>
          <Button variant="outline-secondary" className="mb-3" onClick={() => setActivePage('owners')}><ICONS.ArrowLeftCircle className="me-2" />Back</Button>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h1 className="page-title mb-0">{owner.name}</h1>
            <Badge bg={owner.status === 'approved' ? 'success' : 'danger'} className="fs-5">{owner.status}</Badge>
          </div>
          <Row className="g-4">
            <Col lg={8}>
              <Card className="mb-4"><Card.Body><Row>
                <Col md={6}><strong className="text-muted d-block">Email</strong><p>{owner.email}</p></Col>
                <Col md={6}><strong className="text-muted d-block">Phone</strong><p>{owner.phone}</p></Col>
                <Col md={6}><strong className="text-muted d-block">Joined</strong><p>{formatDateTime(owner.createdAt)}</p></Col>
              </Row></Card.Body></Card>
              
              {owner.shop && (
                <Card className="mb-4"><Card.Header><h5 className="card-title mb-0">Restaurant: {owner.shop?.shopName}</h5></Card.Header><Card.Body>
                  <strong className="text-muted d-block">Address</strong><p>{owner.shop?.shopAddress}</p>
                </Card.Body></Card>
              )}
              
              {owner.orders && owner.orders.length > 0 ? (
                <Card><Card.Header><h5 className="card-title mb-0">Recent Order History</h5></Card.Header><Card.Body>
                  <Table responsive>
                    <thead><tr><th>ID</th><th>Customer</th><th>Amount</th><th>Date</th></tr></thead>
                    <tbody>
                      {owner.orders.map(order => (
                        <tr key={order._id}>
                          <td>{order._id.slice(-6)}</td>
                          <td>{order.customer?.name || 'N/A'}</td>
                          <td>{formatCurrency(order.totalAmount)}</td>
                          <td>{formatDateTime(order.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body></Card>
              ) : (
                <Alert variant="light">No order history found for this owner.</Alert>
              )}
            </Col>
            <Col lg={4}>
              <Card className="mb-4">
                <Card.Header><h5 className="card-title mb-0">Set Commission</h5></Card.Header>
                <Card.Body>
                  <p className="small text-muted">Set the platform commission rate per order for this restaurant.</p>
                  <InputGroup>
                    <Form.Control 
                      type="number"
                      value={commission}
                      onChange={(e) => setCommission(e.target.value)}
                    />
                    <InputGroup.Text>%</InputGroup.Text>
                    <Button variant="primary" onClick={handleSaveCommission} disabled={isSavingComm}>
                      {isSavingComm ? <Spinner as="span" size="sm" /> : 'Save'}
                    </Button>
                  </InputGroup>
                </Card.Body>
              </Card>
              
              <Card className="border-danger"><Card.Header className="bg-danger text-white"><h5>Admin Actions</h5></Card.Header><Card.Body>
                <p className="small text-muted">Permanently delete this owner and all their associated data. This action is irreversible.</p>
                <Button variant="danger" className="w-100" onClick={handleDelete}><ICONS.TrashFill className="me-2" />Delete Owner</Button>
              </Card.Body></Card>
            </Col>
          </Row>
        </div>
      );
    };

    // --- CustomersListPage ---
    const CustomersListPage = ({ setActivePage, api, user }) => {
      const [customers, setCustomers] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [searchTerm, setSearchTerm] = useState('');

      const fetchCustomers = async () => {
        if (!api) return;
        try {
          setLoading(true);
          const { data } = await api.get('/admin/customers');
          setCustomers(data || []); 
          setError(null);
        } catch (err) {
          setError('Failed to fetch customers. The API might not be ready.');
          console.error(err);
          setCustomers([]); 
        } finally {
          setLoading(false);
        }
      };

      useEffect(() => {
        fetchCustomers();
      }, [api]);

      const handleBlockToggle = async (customerId, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
        try {
          await api.put(`/admin/customers/${customerId}/toggle-status`, { status: newStatus });
          fetchCustomers(); // Refresh
        } catch (err) {
          alert(`Failed to ${newStatus} customer.`);
        }
      };

      const filteredCustomers = customers.filter(c =>
        c.email !== user?.email &&
        ((c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.email || '').toLowerCase().includes(searchTerm.toLowerCase()))
      );

      if (loading) return <Loader />;
      
      return (
        <div>
          <h1 className="page-title">Customers</h1>
          {error && <Alert variant="danger">{error}</Alert>}
          <Card>
            <Card.Header className="bg-white border-0 pt-3">
              <InputGroup style={{ maxWidth: '300px' }}>
                <InputGroup.Text><ICONS.Search /></InputGroup.Text>
                <Form.Control placeholder="Search by name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </InputGroup>
            </Card.Header>
            <Card.Body>
              {filteredCustomers.length === 0 ? (
                <Alert variant="info" className="text-center">
                  {searchTerm ? 'No customers match your search.' : 'No customers found.'}
                </Alert>
              ) : (
                <Table responsive hover>
                  <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {filteredCustomers.map(customer => (
                      <tr key={customer._id}>
                        <td className="fw-bold">{customer.name}</td>
                        <td>{customer.email}</td>
                        <td>{customer.phone || 'N/A'}</td>
                        <td><Badge bg={customer.status === 'active' ? 'success' : 'danger'}>{customer.status}</Badge></td>
                        <td>
                          <Button onClick={() => setActivePage(`customer-details:${customer._id}`)} variant="primary" size="sm" className="me-2"><ICONS.EyeFill /></Button>
                          <Button variant={customer.status === 'active' ? 'warning' : 'success'} size="sm" onClick={() => handleBlockToggle(customer._id, customer.status)}>
                            {customer.status === 'active' ? <ICONS.LockFill /> : <ICONS.UnlockFill />}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </div>
      );
    };

    // --- CustomerDetailsPage ---
    const CustomerDetailsPage = ({ customerId, setActivePage, api }) => {
      const [customer, setCustomer] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      useEffect(() => {
        const fetchCustomerDetails = async () => {
          if (!api) return;
          try {
            setLoading(true);
            const { data } = await api.get(`/admin/customers/${customerId}`);
            setCustomer(data);
            setError(null);
          } catch (err) {
            setError('Failed to fetch customer details. The API might not be ready.');
            console.error(err);
          } finally {
            setLoading(false);
          }
        };
        fetchCustomerDetails();
      }, [customerId, api]);

      if (loading) return <Loader />;
      if (error) return <Alert variant="danger">{error}</Alert>;
      if (!customer) return <Alert variant="warning">Customer not found.</Alert>;

      return (
        <div>
          <Button variant="outline-secondary" className="mb-3" onClick={() => setActivePage('customers')}><ICONS.ArrowLeftCircle className="me-2" />Back</Button>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h1 className="page-title mb-0">{customer.name}</h1>
            <Badge bg={customer.status === 'active' ? 'success' : 'danger'} className="fs-5">{customer.status}</Badge>
          </div>
          <Row className="g-4">
            <Col lg={8}>
              <Card className="mb-4"><Card.Body><Row>
                <Col md={6}><strong className="text-muted d-block">Email</strong><p>{customer.email}</p></Col>
                <Col md={6}><strong className="text-muted d-block">Phone</strong><p>{customer.phone || 'N/A'}</p></Col>
                <Col md={6}><strong className="text-muted d-block">Joined</strong><p>{formatDateTime(customer.createdAt)}</p></Col>
              </Row></Card.Body></Card>
              
              {customer.addresses && customer.addresses.length > 0 ? (
                <Card className="mb-4"><Card.Header><h5 className="card-title mb-0">Addresses</h5></Card.Header><ListGroup variant="flush">
                  {customer.addresses.map((addr, index) => (
                    <ListGroup.Item key={index}>
                      <strong>{addr.addressType}</strong>: {addr.fullAddress}, {addr.city}
                    </ListGroup.Item>
                  ))}
                </ListGroup></Card>
              ) : (
                <Alert variant="light">No addresses on file.</Alert>
              )}

              {customer.orders && customer.orders.length > 0 ? (
                <Card><Card.Header><h5 className="card-title mb-0">Recent Order History</h5></Card.Header><Card.Body>
                  <Table responsive>
                    <thead><tr><th>ID</th><th>Restaurant</th><th>Amount</th><th>Date</th></tr></thead>
                    <tbody>
                      {customer.orders.map(order => (
                        <tr key={order._id}>
                          <td>{order._id.slice(-6)}</td>
                          <td>{order.restaurant?.shopName || 'N/A'}</td>
                          <td>{formatCurrency(order.totalAmount)}</td>
                          <td>{formatDateTime(order.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body></Card>
              ) : (
                <Alert variant="light">No order history found.</Alert>
              )}
            </Col>
            <Col lg={4}>
              <Card className="border-danger"><Card.Header className="bg-danger text-white"><h5>Admin Actions</h5></Card.Header><Card.Body>
                <p className="small text-muted">Permanently delete this customer. This action is irreversible.</p>
                <Button variant="danger" className="w-100" onClick={() => alert('Delete feature coming soon!')}><ICONS.TrashFill className="me-2" />Delete Customer</Button>
              </Card.Body></Card>
            </Col>
          </Row>
        </div>
      );
    };

    // --- ComplaintsPage ---
    const ComplaintsPage = ({ api }) => {
      const [complaints, setComplaints] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [selectedComplaint, setSelectedComplaint] = useState(null);
      const [showModal, setShowModal] = useState(false);

      useEffect(() => {
        const fetchComplaints = async () => {
          if (!api) return;
          try {
            setLoading(true);
            const { data } = await api.get('/admin/complaints');
            setComplaints(data || []);
            setError(null);
          } catch (err) {
            setError('Failed to fetch complaints.');
            setComplaints([]);
          } finally {
            setLoading(false);
          }
        };
        fetchComplaints();
      }, [api]);

      const handleReplyClick = (complaint) => {
        setSelectedComplaint(complaint);
        setShowModal(true);
      };
      const handleModalClose = () => setShowModal(false);
      const handleReplySent = (complaintId) => {
        setComplaints(complaints.map(c => c._id === complaintId ? { ...c, status: 'resolved' } : c));
      };

      if (loading) return <Loader />;
      
      return (
        <div>
          <h1 className="page-title">Review Complaints</h1>
          {error && <Alert variant="danger">{error}</Alert>}
          <Card>
            <Card.Header><h5 className="card-title mb-0">All Tickets</h5></Card.Header>
            <Card.Body>
              {complaints.length === 0 ? (
                <Alert variant="info" className="text-center">No complaints found.</Alert>
              ) : (
                <Table responsive hover>
                  <thead><tr><th>User</th><th>Type</th><th>Subject</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {complaints.map(c => (
                      <tr key={c._id}>
                        <td className="fw-bold">{c.user?.email || 'N/A'}</td>
                        <td><Badge bg={c.userType === 'Customer' ? 'info' : 'secondary'}>{c.userType}</Badge></td>
                        <td>{c.subject}</td>
                        <td>{formatDateTime(c.createdAt)}</td>
                        <td><Badge bg={c.status === 'pending' ? 'warning' : 'success'}>{c.status}</Badge></td>
                        <td>
                          <Button variant="primary" size="sm" onClick={() => handleReplyClick(c)} disabled={c.status === 'resolved'}>
                            <ICONS.ReplyFill className="me-1" /> Reply
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
          {selectedComplaint && (
            <ComplaintReplyModal
              show={showModal}
              handleClose={handleModalClose}
              complaint={selectedComplaint}
              onSendReply={handleReplySent}
              api={api} // Pass api to modal
            />
          )}
        </div>
      );
    };

    // --- PromotionsPage ---
    const PromotionsPage = ({ api }) => {
      const [promotions, setPromotions] = useState([]);
      const [restaurants, setRestaurants] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [isSubmitting, setIsSubmitting] = useState(false);
      const [newPromo, setNewPromo] = useState({
        code: '',
        description: '',
        discountType: 'percent',
        discountValue: '',
        shop: 'global' 
      });

      const fetchPromos = async () => {
        try {
          const { data } = await api.get('/admin/promotions');
          setPromotions(data || []);
        } catch (err) {
          setError('Failed to fetch promotions.');
          setPromotions([]);
        }
      };

      const fetchRestaurants = async () => {
        try {
          const { data } = await api.get('/admin/owners?status=approved');
          setRestaurants(data || []);
        } catch (err) {
          setError('Failed to fetch restaurants.');
          setRestaurants([]);
        }
      };

      const loadData = async () => {
        if (!api) return;
        setLoading(true);
        await Promise.all([fetchPromos(), fetchRestaurants()]);
        setLoading(false);
      };

      useEffect(() => {
        loadData();
      }, [api]);

      const handleFormChange = (e) => {
        const { name, value } = e.target;
        setNewPromo(prev => ({ ...prev, [name]: value }));
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        
        const promoData = {
          ...newPromo,
          discountValue: Number(newPromo.discountValue),
          shop: newPromo.shop === 'global' ? null : newPromo.shop
        };

        try {
          await api.post('/admin/promotions', promoData);
          setNewPromo({ code: '', description: '', discountType: 'percent', discountValue: '', shop: 'global' });
          await fetchPromos(); 
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to create promotion.');
        } finally {
          setIsSubmitting(false);
        }
      };
      
      const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this promotion?')) {
          try {
            await api.delete(`/admin/promotions/${id}`);
            await fetchPromos(); 
          } catch (err) {
            alert('Failed to delete promotion.');
          }
        }
      };

      if (loading) return <Loader />;

      return (
        <div>
          <h1 className="page-title">Promotion Strategies</h1>
          {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
          <Row className="g-4">
            <Col lg={4}>
              <Card>
                <Card.Header><h5 className="card-title mb-0"><ICONS.PlusCircleFill className="me-2" />Create New Promotion</h5></Card.Header>
                <Card.Body>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="promoCode">
                      <Form.Label>Promo Code</Form.Label>
                      <Form.Control type="text" name="code" value={newPromo.code} onChange={handleFormChange} placeholder="e.g., WELCOME10" required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="promoDesc">
                      <Form.Label>Description</Form.Label>
                      <Form.Control as="textarea" rows={2} name="description" value={newPromo.description} onChange={handleFormChange} placeholder="e.g., 10% off for new users" required />
                    </Form.Group>
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="promoType">
                          <Form.Label>Discount Type</Form.Label>
                          <Form.Select name="discountType" value={newPromo.discountType} onChange={handleFormChange}>
                            <option value="percent">Percentage (%)</option>
                            <option value="fixed">Fixed (₹)</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3" controlId="promoValue">
                          <Form.Label>Value</Form.Label>
                          <Form.Control type="number" name="discountValue" value={newPromo.discountValue} onChange={handleFormChange} placeholder={newPromo.discountType === 'percent' ? '10' : '100'} required />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Form.Group className="mb-3" controlId="promoShop">
                      <Form.Label>Applies To</Form.Label>
                      <Form.Select name="shop" value={newPromo.shop} onChange={handleFormChange}>
                        <option value="global">All Restaurants</option>
                        {restaurants.map(r => (
                          <option key={r._id} value={r._id}>{r.shopName}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                    
                    <Button variant="primary" type="submit" className="w-100" disabled={isSubmitting}>
                      {isSubmitting ? <Spinner as="span" size="sm" /> : 'Create Promotion'}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={8}>
              <Card>
                <Card.Header><h5 className="card-title mb-0">Active Promotions</h5></Card.Header>
                <Card.Body>
                  {promotions.length === 0 ? (
                    <Alert variant="info" className="text-center">No active promotions found.</Alert>
                  ) : (
                    <Table responsive hover>
                      <thead><tr><th>Code</th><th>Description</th><th>Applies To</th><th>Value</th><th>Actions</th></tr></thead>
                      <tbody>
                        {promotions.map(p => (
                          <tr key={p._id}>
                            <td className="fw-bold">{p.code}</td>
                            <td>{p.description}</td>
                            <td><Badge bg={p.shop ? 'info' : 'secondary'}>{p.shop?.shopName || 'All Restaurants'}</Badge></td>
                            <td>{p.discountType === 'percent' ? `${p.discountValue}%` : formatCurrency(p.discountValue)}</td>
                            <td>
                              <Button variant="outline-primary" size="sm" className="me-2" onClick={() => alert('Edit feature coming soon!')}>
                                <ICONS.PencilFill />
                              </Button>
                              <Button variant="outline-danger" size="sm" onClick={() => handleDelete(p._id)}>
                                <ICONS.TrashFill />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      );
    };

    // --- FeedbacksPage ---
    const FeedbacksPage = ({ api }) => {
      const [feedbacks, setFeedbacks] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
    
      useEffect(() => {
        const fetchFeedbacks = async () => {
          if (!api) return;
          try {
            setLoading(true);
            const { data } = await api.get('/admin/feedbacks');
            setFeedbacks(data || []);
            setError(null);
          } catch (err) {
            setError('Failed to fetch feedbacks.');
            setFeedbacks([]);
          } finally {
            setLoading(false);
          }
        };
        fetchFeedbacks();
      }, [api]);
    
      const StarRating = ({ rating }) => <div>{[...Array(5)].map((_, i) => <ICONS.StarFill key={i} className={i < rating ? 'text-warning' : 'text-light'} />)}</div>;

      if (loading) return <Loader />;

      return (
        <div>
          <h1 className="page-title">Feedbacks</h1>
          {error && <Alert variant="danger">{error}</Alert>}
          <Card>
            <Card.Header><h5 className="card-title mb-0">All User Feedbacks</h5></Card.Header>
            <Card.Body>
              {feedbacks.length === 0 ? (
                <Alert variant="info" className="text-center">No feedbacks submitted yet.</Alert>
              ) : (
                feedbacks.map(fb => (
                  <Card className="mb-3" key={fb._id}>
                    <Card.Body>
                      <div className="d-flex justify-content-between">
                        <div>
                          <h6 className="card-subtitle mb-2 fw-bold">{fb.user?.email || 'N/A'}</h6>
                          <StarRating rating={fb.rating} />
                        </div>
                        <small className="text-muted">{formatDateTime(fb.createdAt)}</small>
                      </div>
                      <p className="card-text mt-3">{fb.comment}</p>
                    </Card.Body>
                  </Card>
                ))
              )}
            </Card.Body>
          </Card>
        </div>
      );
    };

    // --- RevenuePage (NEW) ---
    const RevenuePage = ({ api }) => {
      const [owners, setOwners] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      useEffect(() => {
        const fetchOwners = async () => {
          if (!api) return;
          try {
            setLoading(true);
            const { data } = await api.get('/admin/owners?status=approved');
            setOwners(data || []);
            setError(null);
          } catch (err) {
            setError('Failed to fetch owners.');
            setOwners([]);
          } finally {
            setLoading(false);
          }
        };
        fetchOwners();
      }, [api]);

      if (loading) return <Loader />;

      return (
        <div>
          <h1 className="page-title">Revenue & Payouts</h1>
          {error && <Alert variant="danger">{error}</Alert>}
          <Card>
            <Card.Header><h5 className="card-title mb-0">Restaurant Payouts</h5></Card.Header>
            <Card.Body>
              <p className="text-muted">
                This panel shows commission data based on restaurant sales.
                <br />
                Total Sales and Payable Amount require backend API implementation.
              </p>
              {owners.length === 0 ? (
                <Alert variant="info" className="text-center">No approved owners found.</Alert>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Restaurant</th>
                      <th>Commission Rate</th>
                      <th>Total Sales (Current Cycle)</th>
                      <th>Payable Amount (to Owner)</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {owners.map(o => (
                      <tr key={o._id}>
                        <td className="fw-bold">{o.shopName}</td>
                        <td>{o.commissionRate || 10}%</td>
                        <td className="text-muted"><i>N/A (API needed)</i></td>
                        <td className="text-muted"><i>N/A (API needed)</i></td>
                        <td><Badge bg="secondary">Pending</Badge></td>
                        <td>
                          <Button variant="primary" size="sm" onClick={() => alert('Mark as Paid feature coming soon!')}>
                            Mark as Paid
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </div>
      );
    };

    // --- ProfileSettingsPage ---
    const ProfileSettingsPage = ({ api }) => {
      const { user, login } = useAuth();
      const [formData, setFormData] = useState({ name: user?.name || '', email: user?.email || '' });
      const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

      const handleInfoChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
      const handlePasswordChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

      const handleInfoSubmit = async (e) => {
        e.preventDefault();
        alert('Profile update feature coming soon!');
      };

      const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
          return alert("New passwords don't match!");
        }
        alert('Password change feature coming soon!');
      };

      return (
        <div>
          <h1 className="page-title">Profile Settings</h1>
          <Row className="g-4">
            <Col lg={6}>
              <Card>
                <Card.Header><h5 className="card-title mb-0">My Details</h5></Card.Header>
                <Card.Body>
                  <div className="text-center mb-4">
                    <img src={user?.avatar || `https://placehold.co/120x120/6c56d0/white?text=${user?.name?.charAt(0) || 'A'}`} alt="Admin" className="rounded-circle" width="120" height="120" />
                  </div>
                  <Form onSubmit={handleInfoSubmit}>
                    <Form.Group className="mb-3"><Form.Label>Full Name</Form.Label><Form.Control type="text" name="name" value={formData.name} onChange={handleInfoChange} /></Form.Group>
                    <Form.Group className="mb-3"><Form.Label>Email Address</Form.Label><Form.Control type="email" name="email" value={formData.email} onChange={handleInfoChange} /></Form.Group>
                    <Button variant="primary" type="submit">Update Profile</Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6}>
              <Card>
                <Card.Header><h5 className="card-title mb-0">Change Password</h5></Card.Header>
                <Card.Body>
                  <Form onSubmit={handlePasswordSubmit}>
                    <Form.Group className="mb-3"><Form.Label>Current Password</Form.Label><Form.Control type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} /></Form.Group>
                    <Form.Group className="mb-3"><Form.Label>New Password</Form.Label><Form.Control type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} /></Form.Group>
                    <Form.Group className="mb-3"><Form.Label>Confirm New Password</Form.Label><Form.Control type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} /></Form.Group>
                    <Button variant="primary" type="submit">Change Password</Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      );
    };


    // -------------------------------------------------------------------
    // --- LAYOUT COMPONENTS (MODIFIED) ---
    // -------------------------------------------------------------------
    const Sidebar = ({ activePage, setActivePage, onClose, onSignOut }) => {
      const navItems = [
        { id: 'dashboard', icon: 'GridFill', label: 'Dashboard' },
        { id: 'verification', icon: 'PatchCheckFill', label: 'Verification' },
        { id: 'owners', icon: 'PersonSquare', label: 'Owners' },
        { id: 'customers', icon: 'PeopleFill', label: 'Customers' },
        { id: 'revenue', icon: 'Bank', label: 'Revenue' },
        { id: 'complaints', icon: 'ExclamationTriangleFill', label: 'Complaints' },
        { id: 'promotions', icon: 'MegaphoneFill', label: 'Promotions' },
        { id: 'feedbacks', icon: 'ChatLeftTextFill', label: 'Feedbacks' },
        { id: 'settings', icon: 'GearFill', label: 'Profile Settings' },
      ];

      const handleNavClick = (pageId) => {
        setActivePage(pageId); 
        if (window.innerWidth < 992) onClose();
      };

      return (
        <nav className="sidebar">
          <div>
            <a href="#" onClick={(e) => { e.preventDefault(); handleNavClick('dashboard'); }} className="sidebar-logo">
              <img src="/orderly.jpg" alt="Orderly Logo" className="sidebar-logo-img" />
              <span className="sidebar-logo-text">Orderly Admin</span>
            </a>
            <ul className="sidebar-nav">
              {navItems.map(item => {
                const IconComponent = ICONS[item.icon];
                return (
                  <li className="nav-item" key={item.id}>
                    <a className={`nav-link ${activePage.startsWith(item.id) ? 'active' : ''}`} onClick={() => handleNavClick(item.id)}>
                      <span className="nav-icon"><IconComponent /></span>
                      <span className="nav-link-text">{item.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
          <ul className="sidebar-footer">
            <li className="nav-item">
              <a className="nav-link" onClick={onSignOut} style={{ cursor: 'pointer' }}>
                <span className="nav-icon"><ICONS.BoxArrowRight /></span>
                <span className="nav-link-text">Sign Out</span>
              </a>
            </li>
          </ul>
        </nav>
      );
    };

    const Header = ({ toggleSidebar }) => {
      const { user } = useAuth();
      return (
        <header className="header">
          <button className="header-toggle" onClick={toggleSidebar}><ICONS.List /></button>
          <div className="header-right">
            <div className="profile-dropdown">
              <img src={user?.avatar || `https://placehold.co/80x80/6c56d0/white?text=${user?.name?.charAt(0) || 'A'}`} alt="Profile" className="profile-img" />
              <div className="profile-info d-none d-md-block">
                <span className="profile-name">{user?.name || 'Admin'}</span>
              </div>
            </div>
          </div>
        </header>
      );
    };

    const PageDisplay = ({ activePage, setActivePage, api, user }) => {
      if (activePage.startsWith('verification-details:')) {
        const id = activePage.split(':')[1];
        return <RestaurantDetailsPage restaurantId={id} setActivePage={setActivePage} api={api} />;
      }
      if (activePage.startsWith('owner-details:')) {
        const id = activePage.split(':')[1];
        return <OwnerDetailsPage ownerId={id} setActivePage={setActivePage} api={api} />;
      }
      if (activePage.startsWith('customer-details:')) {
        const id = activePage.split(':')[1];
        return <CustomerDetailsPage customerId={id} setActivePage={setActivePage} api={api} />;
      }
      switch (activePage) {
        case 'dashboard': return <DashboardPage api={api} />;
        case 'verification': return <RestaurantVerificationPage setActivePage={setActivePage} api={api} />;
        case 'owners': return <OwnersListPage setActivePage={setActivePage} api={api} />;
        case 'customers': return <CustomersListPage setActivePage={setActivePage} api={api} user={user} />;
        case 'revenue': return <RevenuePage api={api} />;
        case 'complaints': return <ComplaintsPage api={api} />;
        case 'promotions': return <PromotionsPage api={api} />;
        case 'feedbacks': return <FeedbacksPage api={api} />;
        case 'settings': return <ProfileSettingsPage api={api} />;
        default: return <DashboardPage api={api} />;
      }
    };


    // -------------------------------------------------------------------
    // --- MAIN LAYOUT COMPONENT (MODIFIED) ---
    // -------------------------------------------------------------------

    const AdminDashboard = () => {
      const { logout, token, user } = useAuth(); 
      const navigate = useNavigate();
      const [isSidebarOpen, setIsSidebarOpen] = useState(true);
      
      const [activePage, setActivePage] = useState(
        () => localStorage.getItem('adminActivePage') || 'dashboard'
      );

      const handleSetPage = (pageId) => {
        localStorage.setItem('adminActivePage', pageId);
        setActivePage(pageId);
      };
    
      const api = useMemo(() => {
        const instance = axios.create({
          baseURL: '/api' 
        });
      
        if (token) {
          instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      
        instance.interceptors.response.use(
          (response) => response,
          (error) => {
            if (error.response?.status === 401) {
              logout(); 
              navigate('/admin/login'); 
            }
            return Promise.reject(error);
          }
        );
      
        return instance;
      }, [token, logout, navigate]); 

      useEffect(() => {
        const checkSize = () => {
          if (window.innerWidth < 992) {
            setIsSidebarOpen(false);
          } else {
            setIsSidebarOpen(true);
          }
        };
        checkSize();
        window.addEventListener('resize', checkSize);
        return () => window.removeEventListener('resize', checkSize);
      }, []);

      const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
      const closeSidebar = () => {
        if (window.innerWidth < 992) setIsSidebarOpen(false);
      };
    
      const handleSignOut = () => {
        logout();
        navigate('/admin/login');
      };

      // Show a loader while the auth context is still loading
      // or if the user/token somehow became null
      if (!user || !token) {
        // The AuthProvider's loading state should handle this,
        // but this is a safety net. The interceptor will redirect.
        return <Loader />;
      }

      return (
        <div className="admin-layout-container">
          <GlobalStyles />
          <div className={`admin-layout ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
            <Sidebar 
              activePage={activePage}
              setActivePage={handleSetPage} 
              onClose={closeSidebar}
              onSignOut={handleSignOut}
            />
            <Header toggleSidebar={toggleSidebar} />
            <main className="main-content">
              <PageDisplay 
                activePage={activePage}
                setActivePage={handleSetPage} 
                api={api} 
                user={user} 
              />
            </main>
            <div className="sidebar-overlay" onClick={closeSidebar}></div>
          </div>
        </div>
      );
    };

    export default AdminDashboard;