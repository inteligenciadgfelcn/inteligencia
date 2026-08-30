<%@ Page Title="" Language="C#" MasterPageFile="~/PaginaPrin.master" AutoEventWireup="true" CodeFile="ICIA-SERV-00.aspx.cs" Inherits="Forms_ICIA_SERV_00" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div class="animate__animated p-6">
        <div x-data="sales">
            <ol class="flex text-primary font-semibold dark:text-white-dark">
                <li class="bg-[#ebedf2] rounded-tl-md rounded-bl-md dark:bg-[#1b2e4b]"><a href="Default6" class="p-1.5 ltr:pl-3 rtl:pr-3 ltr:pr-2 rtl:pl-2 relative  h-full flex items-center before:absolute ltr:before:-right-[15px] rtl:before:-left-[15px] rtl:before:rotate-180 before:inset-y-0 before:m-auto before:w-0 before:h-0 before:border-[16px] before:border-l-[15px] before:border-r-0 before:border-t-transparent before:border-b-transparent before:border-l-[#ebedf2] before:z-[1] dark:before:border-l-[#1b2e4b] hover:text-primary/70 dark:hover:text-white-dark/70">Inicio</a></li>
                <li class="bg-[#ebedf2] dark:bg-[#1b2e4b]"><a class="bg-primary text-white-light p-1.5 ltr:pl-6 rtl:pr-6 ltr:pr-2 rtl:pl-2 relative  h-full flex items-center before:absolute ltr:before:-right-[15px] rtl:before:-left-[15px] rtl:before:rotate-180 before:inset-y-0 before:m-auto before:w-0 before:h-0 before:border-[16px] before:border-l-[15px] before:border-r-0 before:border-t-transparent before:border-b-transparent before:border-l-primary before:z-[1]">FORMULARIO: CREACION DE CODIGO DE SERVICIO</a></li>
            </ol>
        </div>
        <br />
        <div class="panel">
            <img class="w-20 h-20 rounded-md overflow-hidden object-cover" src="assets/images/icons8-form-64.png" alt="image"/>
            <div class="flex items-center p-3.5 rounded text-white" style="background: rgb(188,26,78); background: linear-gradient(135deg, rgba(188,26,78,1) 0%, rgba(0,79,230,1) 100%);">
                <span class="ltr:pr-2 rtl:pl-2"><strong class="ltr:mr-1 rtl:ml-1">INTRODUCCION DE DATOS DEL SERVICIO</strong></span>&nbsp;                
            </div>
            <br />
            <div class="mb-5">
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Servicio Entrante</div>
                        <asp:TextBox ID="txtusuario" runat="server" placeholder="" class="form-input form-input-sm" Width="300px"></asp:TextBox>
                    </div>                    
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Numero de Pase</div>
                        <asp:TextBox ID="txtpase" runat="server" placeholder="" class="form-input form-input-sm" Width="150px"></asp:TextBox>
                    </div>      
                </div>
                <br />
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Servicio de Emergencia</div>
                        <asp:DropDownList ID="ddlemergencia" runat="server" class="form-select form-select-sm text-white-dark" AutoPostBack="True" OnSelectedIndexChanged="ddlemergencia_SelectedIndexChanged" Width="300px"></asp:DropDownList>
                    </div>
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Numero de Pase</div>
                        <asp:TextBox ID="txtpaseemer" runat="server" placeholder="" class="form-input form-input-sm" Width="150px"></asp:TextBox>&nbsp;&nbsp;
                        <asp:RequiredFieldValidator ID="rfvpaseemer" runat="server" ErrorMessage="Seleccione Personal de Emergencia" ControlToValidate="txtpaseemer" ValidationGroup="GuardaServicio" class="text-danger mt-1"></asp:RequiredFieldValidator>
                    </div>
                </div>
                <br />
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Fecha y Hora de Ingreso al Servicio</div>
                        <asp:TextBox ID="txtfechaingserv" runat="server" placeholder="" class="form-input form-input-sm" Width="200px"></asp:TextBox>
                    </div>
                </div>
                <br />
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="flex">
                        <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Fecha y Hora de Salida del Servicio</div>
                        <asp:TextBox ID="txtfechasalserv" runat="server" placeholder="" class="form-input form-input-sm" Width="200px"></asp:TextBox>
                    </div>                    
                </div>
                <br />                
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="flex">                        
                        <asp:Button ID="btncreacionservicio" runat="server" Text="Asignar Codigo de Servicio" class="btn btn-primary btn-sm" OnClick="btncreacionservicio_Click" ValidationGroup="GuardaServicio"/>
                        <asp:Label ID="txtnroserv" runat="server" Text="" class="form-input form-input-sm" Font-Bold="True" Width="160px"></asp:Label>                        
                    </div>                    
                </div>          
                <br />
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div class="flex">                        
                        <asp:Button ID="btnguardar" runat="server" Text="Guardar Codigo de Servicio" class="btn btn-danger" OnClick="btnguardar_Click" Visible="False"/>                        
                    </div>                    
                </div>  
            </div>
        </div>
        <br />
    </div>    
</asp:Content>
 