#!/bin/bash
npm install
cd frontend
npm install
npm run lint -- --fix 
npm run build