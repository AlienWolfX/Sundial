<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Meta -->
    <meta name="description" content="Responsive Bootstrap 4 Dashboard Template">
    <meta name="author" content="BootstrapDash">

    <title>{{ config('app.name', 'Laravel') }}</title>

    <link rel="icon" href="{{ asset('img/ico.png') }}" type="image/png">

    <!-- vendor css -->
    <link href="{{ asset("lib/fontawesome-free/css/all.min.css")}}" rel="stylesheet">
    <link href="{{ asset("lib/ionicons/css/ionicons.min.css")}}" rel="stylesheet">
    <link href="{{ asset("lib/typicons.font/typicons.css")}}" rel="stylesheet">
    <link href="{{ asset("lib/flag-icon-css/css/flag-icon.min.css")}}" rel="stylesheet">

    <!-- azia CSS -->
    <link rel="stylesheet" href="{{ asset("css/azia.css")}}">

    <!-- Sundial CSS -->
    <link rel="stylesheet" href="{{ asset("css/sundial.css")}}">

    <style>
      .reading-box {
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 15px;
        background-color: #f9f9f9;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        margin-bottom: 20px;
      }

      .reading-box h6 {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 10px;
      }

      .reading-box p {
        margin: 5px 0;
        font-size: 14px;
      }

      .reading-box #batteryChart,
      .reading-box #solarPanelChart,
      .reading-box #bulbChart {
        margin-top: 15px;
      }

      /* Remove focus outline for the Login button */
      .nav-item .btn:focus {
        outline: none;
        box-shadow: none;
      }
    </style>
  </head>
  <body>

    <div class="az-header">
      <div class="container">
        <div class="az-header-left">
          <a href="{{ url('/')}}" class="az-logo"><span></span>Sundial</a>
          <a href="" id="azMenuShow" class="az-header-menu-icon d-lg-none"><span></span></a>
        </div><!-- az-header-left -->
        <div class="az-header-menu">
          <div class="az-header-menu-header">
            <a href="{{ url('/') }}" class="az-logo"><span></span>Sundial</a>
            <a href="" class="close">&times;</a>
          </div><!-- az-header-menu-header -->
          <ul class="nav">
            @auth
              <li class="nav-item">
                <span class="btn btn-primary ml-3" style="background: none; border: none; color: #007bff; outline: none;">
                  <a href="{{ route('dashboard') }}">
                    <i class="fas fa-user"></i> {{ auth()->user()->name }}
                  </a>
                </span>
              </li>
            @else
              <li class="nav-item">
                <a href="{{ route('login') }}" class="btn btn-primary ml-3" style="background: none; border: none; color: #007bff; outline: none;">
                  <i class="fas fa-sign-in-alt"></i> Login
                </a>
              </li>
            @endauth
          </ul>
        </div><!-- az-header-menu -->
      </div><!-- container -->
    </div><!-- az-header -->

    <div class="az-content az-content-dashboard">
      <div class="container">
        <div class="az-content-body">
          <div class="az-dashboard-one-title">
            <div>
              <h2 class="az-dashboard-title">Hi, welcome to <span class="sundial_greetings">Sundial</span></h2>
            </div>
          </div><!-- az-dashboard-one-title -->

          <div class="az-dashboard-nav">
            <nav class="nav">
              <a class="nav-link active" data-toggle="tab" href="#">Overview</a>
            </nav>
            <nav class="nav"></nav>
          </div>
          <div class="row row-sm mg-b-20">
            <div class="col-lg-6">
             <!-- Total Devices Card -->
             <!-- To be dynamically generated -->
              <div class="card card-dashboard-three">
                <div class="card-header">
                  <p>Total Devices</p>
                  <h6>16,869</h6>
                  <small>Overview of Active, Inactive and For Maintenance streetlights</small>
                </div>
                <div class="card-body">
                  <div class="chart"><canvas id="chartBar5"></canvas></div>
                </div>
              </div>
            </div>

            <!-- Page Views by Page Title Card -->
            <div class="col-lg-6">
              <div class="card card-dashboard-pageviews">
                <div class="card-header">
                  <h6 class="card-title">Streetlights</h6>
                  <small class="text-muted">Please select a streetlight to view</small>
                </div><!-- card-header -->
                <div class="card-body">
                  <div class="az-list-item d-flex justify-content-between align-items-center">
                    <h7 class="sundial_streetlight">
                      <span class="status-dot bg-success"></span> Sa-sa
                    </h7>
                    <span><i class="fas fa-eye"></i></span>
                  </div><!-- list-group-item -->
                  <div class="az-list-item d-flex justify-content-between align-items-center">
                    <h7 class="sundial_streetlight">
                      <span class="status-dot bg-warning"></span> Bitoon
                    </h7>
                    <span><i class="fas fa-eye"></i></span>
                  </div><!-- list-group-item -->
                  <div class="az-list-item d-flex justify-content-between align-items-center">
                    <h7 class="sundial_streetlight">
                      <span class="status-dot bg-danger"></span> Cantabon
                    </h7>
                    <span><i class="fas fa-eye"></i></span>
                  </div><!-- list-group-item -->
                  <div class="az-list-item d-flex justify-content-between align-items-center">
                    <h7 class="sundial_streetlight">
                      <span class="status-dot bg-success"></span> Quarry
                    </h7>
                    <span><i class="fas fa-eye"></i></span>
                  </div><!-- list-group-item -->
                </div><!-- card-body -->
              </div><!-- card -->
            </div><!-- col -->
          </div><!-- row -->

          <!-- Reading Card -->
          <div class="row row-sm mg-b-20">
            <div class="col-lg-12">
              <div class="card card-dashboard-new">
                <div class="card-header">
                  <h6 class="card-title">Streetlight Readings</h6>
                  <small class="text-muted">Last Updated: {{ now()->format('F j, Y, g:i a') }}</small>
                </div><!-- card-header -->
                <div class="card-body">
                  <div class="row">
                    <!-- Streetlight Status -->
                    <div class="col-lg-12 mb-3">
                      <div class="reading-box">
                        <h6>Streetlight Status</h6>
                        <p id="streetlightStatus"><strong>Status:</strong> <span class="text-muted">Select a streetlight to view its status</span></p>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <!-- Battery Readings -->
                    <div class="col-lg-4">
                      <div class="reading-box">
                        <h6>Battery</h6>
                        <p><strong>Voltage:</strong> 12.5 V</p>
                        <p><strong>Current:</strong> 1.2 A</p>
                        <div id="batteryChart"></div>
                      </div>
                    </div>
                    <!-- Solar Panel Readings -->
                    <div class="col-lg-4">
                      <div class="reading-box">
                        <h6>Solar Panel</h6>
                        <p><strong>Voltage:</strong> 18.0 V</p>
                        <p><strong>Current:</strong> 2.5 A</p>
                        <div id="solarPanelChart"></div>
                      </div>
                    </div>
                    <!-- Bulb Readings -->
                    <div class="col-lg-4">
                      <div class="reading-box">
                        <h6>Bulb</h6>
                        <p><strong>Voltage:</strong> 12 V</p>
                        <p><strong>Current:</strong> 0.8 A</p>
                        <div id="bulbChart"></div>
                      </div>
                    </div>
                  </div><!-- row -->
                </div><!-- card-body -->
              </div><!-- card -->
            </div><!-- col -->
          </div><!-- row -->
        </div><!-- az-content-body -->
      </div>
    </div><!-- az-content -->

    <div class="az-footer ht-40">
      <div class="container ht-100p pd-t-0-f">
        <span class="text-muted d-block text-center text-sm-left d-sm-inline-block">Copyright © Sundial 2025</span>
      </div><!-- container -->
    </div><!-- az-footer -->

    <script src="{{ asset("lib/jquery/jquery.min.js")}}"></script>
    <script src="{{ asset("lib/bootstrap/js/bootstrap.bundle.min.js")}}"></script>
    <script src="{{ asset("lib/ionicons/ionicons.js")}}"></script>
    <script src="{{ asset("lib/jquery.flot/jquery.flot.js")}}"></script>
    <script src="{{ asset("lib/jquery.flot/jquery.flot.resize.js")}}"></script>
    <script src="{{ asset("lib/chart.js/Chart.bundle.min.js")}}"></script>
    <script src="{{ asset("lib/peity/jquery.peity.min.js")}}"></script>

    <script src="{{ asset("js/azia.js")}}"></script>
    <script src="{{ asset("js/chart.flot.sampledata.js")}}"></script>
    <script src="{{ asset("js/dashboard.sampledata.js")}}"></script>

    <!-- Include ApexCharts Library -->
    <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
    <!-- Include SweetAlert Library -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="{{ asset('js/sundial.js') }}"></script>;
  </body>
</html>
