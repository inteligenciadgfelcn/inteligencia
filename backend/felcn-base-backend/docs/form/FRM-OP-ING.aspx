<%@ Page Title="" Language="C#" MasterPageFile="~/PaginaPrin.master" AutoEventWireup="true" CodeFile="FRM-OP-ING.aspx.cs" Inherits="Forms_FRM_OP_ING" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" runat="Server">
    <div class="animate__animated p-6">        
        <div class="panel">
            <div class="mb-5 flex items-center justify-between">
                <ol class="flex text-primary font-semibold dark:text-white-dark">
                    <li class="bg-[#ebedf2] rounded-tl-md rounded-bl-md dark:bg-[#1b2e4b]"><a href="Default3" class="p-1.5 ltr:pl-3 rtl:pr-3 ltr:pr-2 rtl:pl-2 relative  h-full flex items-center before:absolute ltr:before:-right-[15px] rtl:before:-left-[15px] rtl:before:rotate-180 before:inset-y-0 before:m-auto before:w-0 before:h-0 before:border-[16px] before:border-l-[15px] before:border-r-0 before:border-t-transparent before:border-b-transparent before:border-l-[#ebedf2] before:z-[1] dark:before:border-l-[#1b2e4b] hover:text-primary/70 dark:hover:text-white-dark/70">Inicio</a></li>
                    <li class="bg-[#ebedf2] dark:bg-[#1b2e4b]"><a class="bg-primary text-white-light p-1.5 ltr:pl-6 rtl:pr-6 ltr:pr-2 rtl:pl-2 relative  h-full flex items-center before:absolute ltr:before:-right-[15px] rtl:before:-left-[15px] rtl:before:rotate-180 before:inset-y-0 before:m-auto before:w-0 before:h-0 before:border-[16px] before:border-l-[15px] before:border-r-0 before:border-t-transparent before:border-b-transparent before:border-l-primary before:z-[1]">REGISTRO DE CASOS</a></li>
                    <li class="bg-[#ebedf2] dark:bg-[#1b2e4b]"><a href="javascript:;" class="p-1.5 px-3 ltr:pl-6 rtl:pr-6 relative  h-full flex items-center before:absolute ltr:before:-right-[15px] rtl:before:-left-[15px] rtl:before:rotate-180 before:inset-y-0 before:m-auto before:w-0 before:h-0 before:border-[16px] before:border-l-[15px] before:border-r-0 before:border-t-transparent before:border-b-transparent before:border-l-[#ebedf2] before:z-[1] dark:before:border-l-[#1b2e4b] hover:text-primary/70 dark:hover:text-white-dark/70">Operativos y Casos para Registrar</a></li>
                </ol>
            </div>
            <asp:Button ID="btnActualizar" runat="server" class="btn btn-success" Text="Actualizar" OnClick="btnActualizar_Click"/>
            <br />
            <asp:GridView ID="GridView2" runat="server" AutoGenerateColumns="False" class="table-striped" OnSelectedIndexChanged="GridView2_SelectedIndexChanged">
                <Columns>
                    <asp:BoundField DataField="P1" HeaderText="Id" />
                    <asp:BoundField DataField="P2" HeaderText="Unidad" />
                    <asp:BoundField DataField="P3" HeaderText="Distrital" />
                    <asp:BoundField DataField="P4" HeaderText="Grupo" />
                    <asp:BoundField DataField="P5" HeaderText="Nro. Caso" />
                    <asp:BoundField DataField="P6" HeaderText="Perdida de Dominio" />
                    <asp:BoundField DataField="P7" HeaderText="Nro. Operativo" />
                    <asp:BoundField DataField="P8" HeaderText="Nombre Operativo" />
                    <asp:BoundField DataField="P9" HeaderText="Asignado al Caso" />
                    <asp:BoundField DataField="P10" HeaderText="Fiscal Asignado" />
                    <asp:BoundField DataField="P11" HeaderText="Quien Registro" />
                    <asp:BoundField DataField="P12" HeaderText="Fecha y Hora Registro" />
                    <asp:CommandField ButtonType="Image" SelectImageUrl="assets/images/distributor-report-icon.png" ShowSelectButton="True" />
                </Columns>
                <RowStyle Font-Size="Small" />
            </asp:GridView>
        </div>
        <br />
        <div x-data="sales">
            <ol class="flex text-primary font-semibold dark:text-white-dark">
                <li class="bg-[#ebedf2] rounded-tl-md rounded-bl-md dark:bg-[#1b2e4b]"><a href="Default3" class="p-1.5 ltr:pl-3 rtl:pr-3 ltr:pr-2 rtl:pl-2 relative  h-full flex items-center before:absolute ltr:before:-right-[15px] rtl:before:-left-[15px] rtl:before:rotate-180 before:inset-y-0 before:m-auto before:w-0 before:h-0 before:border-[16px] before:border-l-[15px] before:border-r-0 before:border-t-transparent before:border-b-transparent before:border-l-[#ebedf2] before:z-[1] dark:before:border-l-[#1b2e4b] hover:text-primary/70 dark:hover:text-white-dark/70">Inicio</a></li>
                <li class="bg-[#ebedf2] dark:bg-[#1b2e4b]"><a class="bg-primary text-white-light p-1.5 ltr:pl-6 rtl:pr-6 ltr:pr-2 rtl:pl-2 relative  h-full flex items-center before:absolute ltr:before:-right-[15px] rtl:before:-left-[15px] rtl:before:rotate-180 before:inset-y-0 before:m-auto before:w-0 before:h-0 before:border-[16px] before:border-l-[15px] before:border-r-0 before:border-t-transparent before:border-b-transparent before:border-l-primary before:z-[1]">REGISTRO DE CASOS</a></li>
            </ol>
        </div>
        <br />
        <div class="panel">
            <div class="mb-5 flex items-center justify-between">
                <ol class="flex text-primary font-semibold dark:text-white-dark">
                    <li class="bg-[#ebedf2] rounded-tl-md rounded-bl-md dark:bg-[#1b2e4b]"><a href="Default3" class="p-1.5 ltr:pl-3 rtl:pr-3 ltr:pr-2 rtl:pl-2 relative  h-full flex items-center before:absolute ltr:before:-right-[15px] rtl:before:-left-[15px] rtl:before:rotate-180 before:inset-y-0 before:m-auto before:w-0 before:h-0 before:border-[16px] before:border-l-[15px] before:border-r-0 before:border-t-transparent before:border-b-transparent before:border-l-[#ebedf2] before:z-[1] dark:before:border-l-[#1b2e4b] hover:text-primary/70 dark:hover:text-white-dark/70">Inicio</a></li>
                    <li class="bg-[#ebedf2] dark:bg-[#1b2e4b]"><a class="bg-primary text-white-light p-1.5 ltr:pl-6 rtl:pr-6 ltr:pr-2 rtl:pl-2 relative  h-full flex items-center before:absolute ltr:before:-right-[15px] rtl:before:-left-[15px] rtl:before:rotate-180 before:inset-y-0 before:m-auto before:w-0 before:h-0 before:border-[16px] before:border-l-[15px] before:border-r-0 before:border-t-transparent before:border-b-transparent before:border-l-primary before:z-[1]">REGISTRO DE CASOS</a></li>
                    <li class="bg-[#ebedf2] dark:bg-[#1b2e4b]"><a href="javascript:;" class="p-1.5 px-3 ltr:pl-6 rtl:pr-6 relative  h-full flex items-center before:absolute ltr:before:-right-[15px] rtl:before:-left-[15px] rtl:before:rotate-180 before:inset-y-0 before:m-auto before:w-0 before:h-0 before:border-[16px] before:border-l-[15px] before:border-r-0 before:border-t-transparent before:border-b-transparent before:border-l-[#ebedf2] before:z-[1] dark:before:border-l-[#1b2e4b] hover:text-primary/70 dark:hover:text-white-dark/70">Del Usuario</a></li>
                </ol>
            </div>
            
            <asp:GridView ID="GridView1" runat="server" AutoGenerateColumns="False" class="table-striped">
                <Columns>
                    <asp:BoundField DataField="P1" HeaderText="Id" />
                    <asp:BoundField DataField="P2" HeaderText="Unidad" />
                    <asp:BoundField DataField="P3" HeaderText="Distrital" />
                    <asp:BoundField DataField="P4" HeaderText="Grupo" />
                    <asp:BoundField DataField="P5" HeaderText="Nro. Caso" />
                    <asp:BoundField DataField="P6" HeaderText="Perdida de Dominio" />
                    <asp:BoundField DataField="P7" HeaderText="Nro. Operativo" />
                    <asp:BoundField DataField="P8" HeaderText="Nombre Operativo" />
                    <asp:BoundField DataField="P9" HeaderText="Asignado al Caso" />
                    <asp:BoundField DataField="P10" HeaderText="Fiscal Asignado" />
                </Columns>
                <RowStyle Font-Size="Small" />
            </asp:GridView>
        </div>        
    </div>
</asp:Content>