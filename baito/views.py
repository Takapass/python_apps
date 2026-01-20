from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
# from django.contrib.auth.decorators import login_required

# Create your views here.


def login_view(request):
    if request.method == "POST":
        username = request.POST["username"]
        password = request.POST["password"]

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect("/")  # ログイン後

    return render(request, "login.html")


def top(request):
    return render(request, 'baito/top.html')


def sift(request):
    return render(request, 'baito/sift.html')


def login_view(request):
    return render(request, 'baito/login.html')


def signup(request):
    return render(request, 'baito/signup.html')


def setting(request):
    return render(request, 'baito/setting.html')
