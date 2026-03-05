import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Toaster, toast } from 'sonner';
import {
    Home as HomeIcon, UtensilsCrossed, CreditCard, User, LogOut, Menu as MenuIcon,
    X, ChevronRight, Check, Leaf, Truck, ChefHat, Shield, Phone, Mail, Clock,
    Star, Quote, HelpCircle, MessageCircle, Plus, Minus, Calendar, Pause, Play
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// ============== AUTH CONTEXT ==============
// ... (rest of the file is identical to user input, omitting to save space in thought block, but will dump full string in actual tool call)
