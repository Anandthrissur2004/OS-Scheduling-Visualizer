# OS Scheduling Visualizer

An interactive web-based Operating System project that demonstrates and compares disk scheduling and CPU scheduling algorithms using visual representations, Gantt charts, and performance calculations.

## Project Overview

The OS Scheduling Visualizer helps students understand how an operating system schedules disk I/O requests and CPU processes.

The project contains two modules:

- **Disk Scheduling:** Implements FCFS, SSTF, SCAN, C-SCAN and LOOK.
- **CPU Scheduling:** Implements FCFS and SJF (Non-Preemptive).

## Technologies Used

- **HTML5** – Creates the structure of the application.
- **CSS3** – Provides styling and layout.
- **JavaScript** – Implements scheduling algorithms and calculations.
- **HTML5 Canvas / CSS** – Used for visual representations and animations, where implemented.

No Python or backend server is required.

## Features

### 1. Disk Scheduling Visualizer

Implemented algorithms:

1. FCFS – First Come First Serve
2. SSTF – Shortest Seek Time First
3. SCAN – Elevator Algorithm
4. C-SCAN – Circular SCAN
5. LOOK

**Inputs:**
- Disk size
- Initial head position
- Disk request queue
- Direction of head movement (for SCAN, C-SCAN and LOOK)

**Outputs:**
- Disk head service sequence
- Total head movement
- Visual seek graph
- Algorithm comparison chart

### 2. CPU Scheduling Visualizer

Implemented algorithms:

1. FCFS – First Come First Serve
2. SJF – Shortest Job First (Non-Preemptive)

**Inputs:**
- Process ID
- Arrival Time
- Burst Time
- Priority

**Outputs:**
- Process execution order
- Animated Gantt chart
- Completion Time (CT)
- Turnaround Time (TAT)
- Waiting Time (WT)
- Average Waiting Time
- Average Turnaround Time
- FCFS and SJF comparison

**Note:** Priority is accepted as input but is not used by FCFS or SJF.

## Project Structure

```text
OS-Scheduling-Visualizer/
│
├── index.html
├── style.css
├── script.js
│
├── cpu.html
├── cpu.css
├── cpu.js
│
└── README.md
```

The filenames above are a suggested structure. Update them to match the actual files in your repository.

## How to Run

1. Download or clone this repository.
2. Open the project folder in Visual Studio Code.
3. Open the required HTML file.
4. Run it in a web browser.
5. Enter the input values.
6. Select a scheduling algorithm.
7. View the scheduling sequence, graphs and calculated results.

You can also use the **Live Server** extension in Visual Studio Code.

## Sample Disk Scheduling Input

| Parameter | Value |
|---|---|
| Disk Size | 200 |
| Initial Head Position | 53 |
| Request Queue | 98, 183, 37, 122, 14, 124, 65, 67 |
| Direction | Right |

### Sample Disk Scheduling Results

| Algorithm | Total Head Movement |
|---|---:|
| FCFS | 640 |
| SSTF | 236 |
| SCAN | 331 |
| C-SCAN | 382 |
| LOOK | 299 |

*These results use cylinders 0–199, with SCAN, C-SCAN and LOOK initially moving towards the right. C-SCAN includes the movement from cylinder 199 to cylinder 0.*

## Sample CPU Scheduling Input

| Process | Arrival Time | Burst Time | Priority |
|---|---:|---:|---:|
| P1 | 0 | 5 | 2 |
| P2 | 1 | 3 | 1 |
| P3 | 2 | 8 | 3 |
| P4 | 3 | 2 | 4 |

### Sample CPU Scheduling Results

| Algorithm | Average WT | Average TAT |
|---|---:|---:|
| FCFS | 5.75 | 10.25 |
| SJF Non-Preemptive | 4.00 | 8.50 |

## Project Objectives

- Understand disk and CPU scheduling concepts.
- Implement different scheduling algorithms.
- Visualize the execution of scheduling algorithms.
- Calculate and compare scheduling performance.
- Understand the advantages and limitations of each algorithm.

## Future Enhancements

- Add C-LOOK and other scheduling algorithms.
- Add real-time request generation.
- Include rotational latency and transfer time.
- Add disk energy estimation.
- Improve visual animations and graphs.
- Add more scheduling algorithms such as SRTF, Priority and Round Robin.

## Conclusion

The OS Scheduling Visualizer provides an interactive way to understand important operating system scheduling algorithms. It helps students compare different algorithms through visual representations and performance calculations.

## Author

**Anand B Krishna**

MCA Student  
Christ College of Engineering, Irinjalakuda

## License

This project is developed for educational and academic purposes.
